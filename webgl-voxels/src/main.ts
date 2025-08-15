class VoxelRenderer {
  private canvas!: HTMLCanvasElement;
  private gl!: WebGLRenderingContext;

  constructor(canvasId: string) {
    this.initCanvas(canvasId);
    this.initWebGL();
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

  private render(): void {
    // Clear the screen
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Request next frame
    requestAnimationFrame(() => this.render());
  }

  public start(): void {
    console.log("Starting render loop...");
    this.render();
  }
}

const renderer = new VoxelRenderer("gameCanvas");
renderer.start();
