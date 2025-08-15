# WebGL Fundamentals: First Principles Reference

## Core Understanding

### What WebGL Actually Is

**WebGL is NOT a 3D library.** It's a **rasterization API** - it takes mathematical descriptions and turns them into colored pixels on your screen.

- **Input**: Coordinates and instructions
- **Output**: Colored pixels on screen
- **Your job**: Provide the math to convert 3D scenes to 2D screen positions

### The Two-Part Process

1. **Vertex Processing**: Position triangle corners in clip space
2. **Pixel Drawing**: Color the pixels inside those triangles

---

## Graphics Terminology

### Raster & Rasterization

- **Raster**: A grid of pixels (your screen)
- **Rasterization**: Converting math shapes into colored pixels
- **Process**: "This triangle should color pixels (100,50) through (200,150)"

### Vertices & Triangles

- **Vertex**: A point/corner with coordinates
- **Triangle**: GPU's favorite shape - always flat, no ambiguity
- **Why triangles?**: Any 3 points always define exactly one flat plane

### Clip Space

- **Coordinate system for screen positions**
- **Range**: -1 to +1 in all directions
- **(-1,-1)**: Bottom-left of your canvas
- **(1,1)**: Top-right of your canvas
- **(0,0)**: Dead center
- **Works on any screen size**

---

## The WebGL Pipeline

### The Two Shaders (Required)

**Vertex Shader**

```glsl
// Runs once per vertex
// Job: "Where does this corner go on screen?"
void main() {
  gl_Position = /* clip space coordinates */;
}
```

**Fragment Shader**

```glsl
// Runs once per pixel
// Job: "What color is this pixel?"
precision mediump float;
void main() {
  gl_FragColor = /* color (R,G,B,A from 0-1) */;
}
```

### The Process

1. **Vertex shader runs** 3 times (for triangle) → positions 3 corners
2. **GPU figures out** which pixels are inside the triangle
3. **Fragment shader runs** once per inside pixel → colors each pixel

---

## Data Flow: How Shaders Get Information

### 1. Attributes (Vertex Shader Only)

**Different data for each vertex**

**Examples:**

- Position: Vertex 1 at (10,20), Vertex 2 at (50,80), Vertex 3 at (30,60)
- Color: Vertex 1 is red, Vertex 2 is blue, Vertex 3 is green

**Why needed:** Each corner needs its own position/properties

### 2. Uniforms (Both Shaders)

**Same data for everything in one draw call**

**Examples:**

- Screen resolution (all vertices need this for positioning)
- Current time (for animations)
- Object color (if whole triangle is red)
- Light position

**Why needed:** Efficient way to share common information

### 3. Varyings (Pass Between Shaders)

**Interpolated data from vertex to fragment shader**

**Process:**

- Vertex shader sets values at triangle corners
- GPU smoothly blends these values across triangle surface
- Fragment shader receives blended value for each pixel

**Example:** Red corner + Blue corner = Purple pixels in between

---

## Buffers & Setup

### What Are Buffers?

**Containers that ship data to GPU memory**

```javascript
// Create container
var buffer = gl.createBuffer();

// Fill with data
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
```

**Why needed:** GPU needs data in its own fast memory

### The Setup Pattern (Do This Every Time)

```javascript
// 1. Create shader program
var program = createProgram(gl, vertexShader, fragmentShader);

// 2. Look up locations
var positionLocation = gl.getAttribLocation(program, "a_position");
var colorLocation = gl.getUniformLocation(program, "u_color");

// 3. Create buffer with data
var buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// 4. Before drawing: connect buffer to shader
gl.useProgram(program);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// 5. Set uniforms and draw
gl.uniform4f(colorLocation, 1, 0, 0, 1); // red
gl.drawArrays(gl.TRIANGLES, 0, 3);
```

---

## Key Concepts

### Interpolation Magic

**You define 3 values (at corners), GPU creates thousands (across surface)**

This is how graphics work - define properties at vertices, GPU smoothly fills in everything between.

### Vertices vs Indices

**Without indices (wasteful):**

```javascript
vertices = [A, B, C, B, C, D]; // B and C duplicated
```

**With indices (efficient):**

```javascript
vertices = [A, B, C, D];
indices = [0, 1, 2, 1, 2, 3]; // Point to vertices to use
```

### WebGL State Machine

WebGL has global state. Functions like `gl.bindBuffer()` and `gl.useProgram()` set what's "currently active."

**Most bugs happen** when wrong buffer/program is bound.

---

## Common Gotchas

### Fragment Shader Precision

Always include: `precision mediump float;`

### Color Ranges

WebGL colors: 0.0 to 1.0 (not 0-255)

### GLSL Type Strictness

```glsl
float f = 1;    // ERROR
float f = 1.0;  // CORRECT
```

### Draw Count Parameter

`gl.drawArrays(gl.TRIANGLES, 0, count)` - count is **vertices**, not triangles

- 1 triangle = count of 3
- 2 triangles = count of 6

### Varying Names Must Match Exactly

```glsl
// Vertex shader
varying vec4 v_color;

// Fragment shader
varying vec4 v_color; // Same name and type
```

---

## The Big Picture

WebGL is conceptually simple:

1. Position some triangle corners
2. Color the pixels inside those triangles
3. Repeat for more triangles

All the complexity comes from the math YOU provide to:

- Convert 3D world positions to 2D screen positions
- Calculate lighting, textures, and effects
- Manage the data flow efficiently

**Remember**: WebGL just rasterizes. Everything else is your math.
