class VoxelRenderer {
  private canvas!: HTMLCanvasElement;
  private gl!: WebGLRenderingContext;
  private shaderProgram!: WebGLProgram;
  private positionBuffer!: WebGLBuffer;
  private positionAttributeLocation!: number;
  private mvpMatrixLocation!: WebGLUniformLocation;
  private rotation: number = 0;
  private rotationX: number = 0;
  private rotationY: number = 0;
  private mouseDown: boolean = false;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;
  private cubePositions!: Float32Array;
  private numCubes: number = 8;

  constructor(canvasId: string) {
    this.initCanvas(canvasId);
    this.initWebGL();
    this.initShaders();
    this.initGeometry();
    this.init3D();
    this.initControls();
    this.initCubePositions();
  }

  private initCanvas(canvasId: string): void {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;

    if (!this.canvas) {
      throw new Error(`Canvas with id '${canvasId}' not found`);
    }

    console.log(
      "Canvas initialized:",
      this.canvas.width,
      "x",
      this.canvas.height
    );
  }

  private initWebGL(): void {
    // Get WebGL context
    this.gl = this.canvas.getContext("webgl") as WebGLRenderingContext;

    if (!this.gl) {
      throw new Error("WebGL not supported in this browser");
    }

    // Set viewport to match canvas size
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    // Set clear color (background)
    this.gl.clearColor(0.1, 0.1, 0.2, 1.0); // Dark blue

    console.log("WebGL initialized successfully");
    console.log("WebGL version:", this.gl.getParameter(this.gl.VERSION));
  }

  private init3D(): void {
    // Enable depth testing
    this.gl.enable(this.gl.DEPTH_TEST);

    // Get matrix uniform location
    this.mvpMatrixLocation = this.gl.getUniformLocation(
      this.shaderProgram,
      "u_mvpMatrix"
    )!;

    console.log("3D setup complete");
  }

  private initGeometry(): void {
    // Cube vertices (8 corners)
    const cubeVertices = new Float32Array([
      // Front face
      -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5,
      0.5, -0.5, 0.5, 0.5,

      // Back face
      -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
      0.5, -0.5, 0.5, 0.5, -0.5,

      // Top face
      -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5,
      0.5, 0.5, 0.5, -0.5,

      // Bottom face
      -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5,
      -0.5, -0.5, 0.5, -0.5, 0.5,

      // Right face
      0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5,
      0.5, 0.5, -0.5, 0.5,

      // Left face
      -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5,
      -0.5, 0.5, -0.5, 0.5, 0.5,
    ]);

    this.positionBuffer = this.gl.createBuffer()!;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, cubeVertices, this.gl.STATIC_DRAW);

    this.positionAttributeLocation = this.gl.getAttribLocation(
      this.shaderProgram,
      "a_position"
    );

    console.log("Cube geometry created");
  }

  private createPerspectiveMatrix(): Float32Array {
    const fieldOfView = (45 * Math.PI) / 180; // 45 degrees in radians
    const aspect = this.canvas.width / this.canvas.height;
    const near = 0.1;
    const far = 100.0;

    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfView);
    const rangeInv = 1.0 / (near - far);

    return new Float32Array([
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (near + far) * rangeInv,
      -1,
      0,
      0,
      near * far * rangeInv * 2,
      0,
    ]);
  }

  private initCubePositions(): void {
    // Create a small grid of cube positions
    this.cubePositions = new Float32Array([
      -1.5,
      -1.5,
      0, // Bottom left
      1.5,
      -1.5,
      0, // Bottom right
      -1.5,
      1.5,
      0, // Top left
      1.5,
      1.5,
      0, // Top right
      -1.5,
      -1.5,
      2, // Back bottom left
      1.5,
      -1.5,
      2, // Back bottom right
      -1.5,
      1.5,
      2, // Back top left
      1.5,
      1.5,
      2, // Back top right
    ]);

    console.log(`${this.numCubes} cube positions created`);
  }

  private createModelViewMatrix(cubeIndex: number): Float32Array {
    const cosX = Math.cos(this.rotationX);
    const sinX = Math.sin(this.rotationX);
    const cosY = Math.cos(this.rotationY);
    const sinY = Math.sin(this.rotationY);

    // Get position for this cube
    const x = this.cubePositions[cubeIndex * 3 + 0];
    const y = this.cubePositions[cubeIndex * 3 + 1];
    const z = this.cubePositions[cubeIndex * 3 + 2];

    // Combined rotation + translation matrix
    return new Float32Array([
      cosY,
      sinX * sinY,
      cosX * sinY,
      0,
      0,
      cosX,
      -sinX,
      0,
      -sinY,
      sinX * cosY,
      cosX * cosY,
      0,
      x,
      y,
      z - 5,
      1, // Position each cube + move back 5 units
    ]);
  }

  private multiplyMatrices(a: Float32Array, b: Float32Array): Float32Array {
    const result = new Float32Array(16);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i * 4 + j] =
          a[i * 4 + 0] * b[0 * 4 + j] +
          a[i * 4 + 1] * b[1 * 4 + j] +
          a[i * 4 + 2] * b[2 * 4 + j] +
          a[i * 4 + 3] * b[3 * 4 + j];
      }
    }

    return result;
  }

  private render(): void {
    // Clear the screen
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Create perspective matrix once
    const perspective = this.createPerspectiveMatrix();

    // Bind geometry once (same for all cubes)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    this.gl.vertexAttribPointer(
      this.positionAttributeLocation,
      3,
      this.gl.FLOAT,
      false,
      0,
      0
    );

    // Draw each cube at its position
    for (let i = 0; i < this.numCubes; i++) {
      const modelView = this.createModelViewMatrix(i);
      const mvpMatrix = this.multiplyMatrices(perspective, modelView);

      // Upload matrix for this cube
      this.gl.uniformMatrix4fv(this.mvpMatrixLocation, false, mvpMatrix);

      // Draw this cube
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 36);
    }

    requestAnimationFrame(() => this.render());
  }

  public start(): void {
    console.log("Starting render loop...");
    this.render();
  }

  private initShaders(): void {
    // Vertex shader - now with 3D position and perspective
    const vertexShaderSource = `
        attribute vec3 a_position;
        uniform mat4 u_mvpMatrix;
        
        void main() {
            gl_Position = u_mvpMatrix * vec4(a_position, 1.0);
        }
    `;

    // Fragment shader stays the same
    const fragmentShaderSource = `
        precision mediump float;
        
        void main() {
            gl_FragColor = vec4(1.0, 0.5, 0.2, 1.0); // Orange
        }
    `;

    const vertexShader = this.createShader(
      this.gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = this.createShader(
      this.gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    this.shaderProgram = this.createProgram(vertexShader, fragmentShader);
    this.gl.useProgram(this.shaderProgram);

    console.log("3D Shaders initialized");
  }

  private createShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const error = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw new Error(`Shader compilation error: ${error}`);
    }

    return shader;
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram {
    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const error = this.gl.getProgramInfoLog(program);
      this.gl.deleteProgram(program);
      throw new Error(`Program linking error: ${error}`);
    }

    return program;
  }

  private initControls(): void {
    this.canvas.addEventListener("mousedown", (e) => {
      this.mouseDown = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    this.canvas.addEventListener("mouseup", () => {
      this.mouseDown = false;
    });

    this.canvas.addEventListener("mousemove", (e) => {
      if (this.mouseDown) {
        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;

        this.rotationY += deltaX * 0.01;
        this.rotationX += deltaY * 0.01;

        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      }
    });

    console.log("Mouse controls initialized");
  }
}

const renderer = new VoxelRenderer("gameCanvas");
renderer.start();
