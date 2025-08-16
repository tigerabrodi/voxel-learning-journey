const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const generateBtn = document.getElementById("generate") as HTMLButtonElement;
const scaleSlider = document.getElementById("scale") as HTMLInputElement;

// For now, we'll do CPU-based noise to get the structure working
// Then convert to compute shader in next step
function simpleNoise(x: number, y: number, scale: number): number {
  // Basic pseudo-random noise
  const n = Math.sin(x * scale) * Math.sin(y * scale) * 1000;
  return n - Math.floor(n); // Get fractional part
}

function generateNoiseTexture() {
  const imageData = ctx.createImageData(512, 512);
  const scale = parseFloat(scaleSlider.value);

  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const noise = simpleNoise(x, y, scale);
      const gray = Math.floor(noise * 255);
      const index = (y * 512 + x) * 4;

      imageData.data[index] = gray; // R
      imageData.data[index + 1] = gray; // G
      imageData.data[index + 2] = gray; // B
      imageData.data[index + 3] = 255; // A
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

generateBtn.addEventListener("click", generateNoiseTexture);
generateNoiseTexture(); // Initial generation
