const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const generateBtn = document.getElementById("generate") as HTMLButtonElement;
const scaleSlider = document.getElementById("scale") as HTMLInputElement;

let device: GPUDevice;
let computePipeline: GPUComputePipeline;
let outputBuffer: GPUBuffer;
let stagingBuffer: GPUBuffer;

const TEXTURE_SIZE = 512;

// Compute shader code (WGSL)
const computeShaderCode = `
@group(0) @binding(0) var<storage, read_write> output: array<f32>;
@group(0) @binding(1) var<uniform> scale: f32;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let x = global_id.x;
    let y = global_id.y;
    
    if (x >= 512u || y >= 512u) {
        return;
    }
    
    // Same noise function as CPU version
    let fx = f32(x);
    let fy = f32(y);
    let n = sin(fx * scale) * sin(fy * scale) * 1000.0;
    let noise = n - floor(n); // Get fractional part
    
    let index = y * 512u + x;
    output[index] = noise;
}
`;

async function initWebGPU() {
  // Check WebGPU support
  if (!navigator.gpu) {
    alert("WebGPU not supported");
    return false;
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    alert("No WebGPU adapter found");
    return false;
  }

  device = await adapter.requestDevice();

  // Create compute shader
  const shaderModule = device.createShaderModule({
    code: computeShaderCode,
  });

  computePipeline = device.createComputePipeline({
    layout: "auto",
    compute: {
      module: shaderModule,
      entryPoint: "main",
    },
  });

  // Create buffers
  const bufferSize = TEXTURE_SIZE * TEXTURE_SIZE * 4; // 4 bytes per f32

  outputBuffer = device.createBuffer({
    size: bufferSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  stagingBuffer = device.createBuffer({
    size: bufferSize,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  });

  return true;
}

async function generateNoiseTextureGPU() {
  const scale = parseFloat(scaleSlider.value);

  // Create uniform buffer for scale
  const uniformBuffer = device.createBuffer({
    size: 4, // f32 = 4 bytes
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([scale]));

  // Create bind group
  const bindGroup = device.createBindGroup({
    layout: computePipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: { buffer: outputBuffer },
      },
      {
        binding: 1,
        resource: { buffer: uniformBuffer },
      },
    ],
  });

  // Dispatch compute shader
  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();

  passEncoder.setPipeline(computePipeline);
  passEncoder.setBindGroup(0, bindGroup);

  // Dispatch 32x32 workgroups (each workgroup is 16x16 threads)
  const workgroupsX = Math.ceil(TEXTURE_SIZE / 16);
  const workgroupsY = Math.ceil(TEXTURE_SIZE / 16);
  passEncoder.dispatchWorkgroups(workgroupsX, workgroupsY);

  passEncoder.end();

  // Copy result to staging buffer
  commandEncoder.copyBufferToBuffer(
    outputBuffer,
    0,
    stagingBuffer,
    0,
    TEXTURE_SIZE * TEXTURE_SIZE * 4
  );

  device.queue.submit([commandEncoder.finish()]);

  // Read results back
  await stagingBuffer.mapAsync(GPUMapMode.READ);
  const arrayBuffer = stagingBuffer.getMappedRange();
  const noiseData = new Float32Array(arrayBuffer);

  // Convert to image data
  const imageData = ctx.createImageData(TEXTURE_SIZE, TEXTURE_SIZE);

  for (let i = 0; i < noiseData.length; i++) {
    const gray = Math.floor(noiseData[i] * 255);
    const pixelIndex = i * 4;

    imageData.data[pixelIndex] = gray; // R
    imageData.data[pixelIndex + 1] = gray; // G
    imageData.data[pixelIndex + 2] = gray; // B
    imageData.data[pixelIndex + 3] = 255; // A
  }

  ctx.putImageData(imageData, 0, 0);
  stagingBuffer.unmap();
}

// Fallback CPU version
function generateNoiseTextureCPU() {
  const imageData = ctx.createImageData(TEXTURE_SIZE, TEXTURE_SIZE);
  const scale = parseFloat(scaleSlider.value);

  for (let y = 0; y < TEXTURE_SIZE; y++) {
    for (let x = 0; x < TEXTURE_SIZE; x++) {
      const n = Math.sin(x * scale) * Math.sin(y * scale) * 1000;
      const noise = n - Math.floor(n);
      const gray = Math.floor(noise * 255);
      const index = (y * TEXTURE_SIZE + x) * 4;

      imageData.data[index] = gray;
      imageData.data[index + 1] = gray;
      imageData.data[index + 2] = gray;
      imageData.data[index + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// Initialize and set up event handlers
initWebGPU().then((success) => {
  if (success) {
    console.log("WebGPU initialized, using GPU compute shader");
    generateBtn.addEventListener("click", generateNoiseTextureGPU);
    generateNoiseTextureGPU();
  } else {
    console.log("WebGPU failed, falling back to CPU");
    generateBtn.addEventListener("click", generateNoiseTextureCPU);
    generateNoiseTextureCPU();
  }
});
