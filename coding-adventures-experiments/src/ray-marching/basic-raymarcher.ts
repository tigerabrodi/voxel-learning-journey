const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const gl = canvas.getContext("webgl2")!;
const distanceSlider = document.getElementById("distance") as HTMLInputElement;

// Vertex shader - just draws a full-screen quad
const vertexShaderSource = `#version 300 es
in vec2 position;
out vec2 uv;

void main() {
    uv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}`;

// Fragment shader - the ray marching magic happens here
const fragmentShaderSource = `#version 300 es
precision highp float;

in vec2 uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_cameraDistance;

// Signed Distance Functions
float sphereSDF(vec3 p, float radius) {
    return length(p) - radius;
}

float boxSDF(vec3 p, vec3 size) {
    vec3 d = abs(p) - size;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

// Scene distance function
vec2 sceneSDF(vec3 p) {
    // Red sphere at origin
    float sphere = sphereSDF(p - vec3(0.0, 0.0, 0.0), 1.0);
    
    // Green cube offset to the right
    float cube = boxSDF(p - vec3(2.5, 0.0, 0.0), vec3(0.8));
    
    // Return closest distance and material ID
    if (sphere < cube) {
        return vec2(sphere, 1.0); // material 1 = red sphere
    } else {
        return vec2(cube, 2.0);   // material 2 = green cube
    }
}

// Calculate surface normal using finite differences
vec3 getNormal(vec3 p) {
    float eps = 0.001;
    return normalize(vec3(
        sceneSDF(p + vec3(eps, 0, 0)).x - sceneSDF(p - vec3(eps, 0, 0)).x,
        sceneSDF(p + vec3(0, eps, 0)).x - sceneSDF(p - vec3(0, eps, 0)).x,
        sceneSDF(p + vec3(0, 0, eps)).x - sceneSDF(p - vec3(0, 0, eps)).x
    ));
}

// Ray marching function
vec2 rayMarch(vec3 rayOrigin, vec3 rayDirection) {
    float totalDistance = 0.0;
    float materialId = 0.0;
    
    for (int i = 0; i < 100; i++) {
        vec3 currentPos = rayOrigin + rayDirection * totalDistance;
        vec2 sceneInfo = sceneSDF(currentPos);
        float distanceToScene = sceneInfo.x;
        materialId = sceneInfo.y;
        
        // If we're close enough to a surface, we hit something
        if (distanceToScene < 0.001) {
            break;
        }
        
        // If we're too far away, we missed everything
        if (totalDistance > 50.0) {
            materialId = 0.0; // background
            break;
        }
        
        // Step forward by the safe distance
        totalDistance += distanceToScene;
    }
    
    return vec2(totalDistance, materialId);
}

void main() {
    // Convert pixel coordinates to ray direction
    vec2 screenPos = (uv - 0.5) * 2.0;
    screenPos.x *= u_resolution.x / u_resolution.y; // aspect ratio correction
    
    // Camera setup
    vec3 cameraPos = vec3(0.0, 0.0, u_cameraDistance);
    vec3 rayDirection = normalize(vec3(screenPos, -1.0));
    
    // Ray march to find intersection
    vec2 result = rayMarch(cameraPos, rayDirection);
    float distance = result.x;
    float materialId = result.y;
    
    vec3 color = vec3(0.1, 0.1, 0.2); // background color
    
    if (materialId > 0.5) {
        // We hit something! Calculate lighting
        vec3 hitPoint = cameraPos + rayDirection * distance;
        vec3 normal = getNormal(hitPoint);
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        
        // Basic diffuse lighting
        float lighting = max(0.0, dot(normal, lightDir));
        
        // Material colors
        if (materialId < 1.5) {
            color = vec3(1.0, 0.2, 0.2) * (0.3 + 0.7 * lighting); // red sphere
        } else {
            color = vec3(0.2, 1.0, 0.2) * (0.3 + 0.7 * lighting); // green cube
        }
    }
    
    fragColor = vec4(color, 1.0);
}`;

let program: WebGLProgram;
let positionBuffer: WebGLBuffer;
let uniformLocations: any = {};

function createShader(type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw new Error("Shader compilation failed");
  }

  return shader;
}

function initWebGL() {
  // Create shaders
  const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Create program
  program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    throw new Error("Program linking failed");
  }

  // Get uniform locations
  uniformLocations.time = gl.getUniformLocation(program, "u_time");
  uniformLocations.resolution = gl.getUniformLocation(program, "u_resolution");
  uniformLocations.cameraDistance = gl.getUniformLocation(
    program,
    "u_cameraDistance"
  );

  // Create full-screen quad
  const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

  positionBuffer = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  // Setup vertex attributes
  const positionLocation = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
}

function render() {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  // Set uniforms
  gl.uniform1f(uniformLocations.time, Date.now() * 0.001);
  gl.uniform2f(uniformLocations.resolution, canvas.width, canvas.height);
  gl.uniform1f(
    uniformLocations.cameraDistance,
    parseFloat(distanceSlider.value)
  );

  // Draw full-screen quad
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  requestAnimationFrame(render);
}

// Initialize and start rendering
initWebGL();
distanceSlider.addEventListener("input", () => {
  // Render happens automatically via requestAnimationFrame
});

render();
