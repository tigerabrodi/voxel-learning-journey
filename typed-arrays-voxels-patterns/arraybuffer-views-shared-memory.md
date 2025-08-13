# ArrayBuffer Views & Shared Memory

## The Core Concept

**One chunk of memory, multiple ways to interpret it:**

```typescript
// 1. Create raw memory buffer
const buffer = new ArrayBuffer(8192); // 8KB of raw memory

// 2. Create different "views" into the SAME memory
const blocks = new Uint8Array(buffer, 0, 4096); // First 4KB: block types
const lighting = new Uint8Array(buffer, 4096, 4096); // Last 4KB: light levels

// All views share the same memory!
blocks[0] = 5;
console.log(buffer); // The raw buffer changed!
```

## Practical Voxel Example

```typescript
// 16×16×16 chunk with multiple data types
const CHUNK_SIZE = 16 * 16 * 16; // 4,096 voxels
const buffer = new ArrayBuffer(CHUNK_SIZE * 3); // 3 bytes per voxel

// Layout memory efficiently
const blocks = new Uint8Array(buffer, 0, CHUNK_SIZE); // Offset 0
const lighting = new Uint8Array(buffer, CHUNK_SIZE, CHUNK_SIZE); // Offset 4096
const metadata = new Uint8Array(buffer, CHUNK_SIZE * 2, CHUNK_SIZE); // Offset 8192

// Access like normal arrays
blocks[100] = 1; // Stone
lighting[100] = 15; // Bright light
metadata[100] = 64; // Some flag
```

## Overlapping Views (Advanced)

```typescript
const buffer = new ArrayBuffer(16);

// Same memory, different interpretations
const bytes = new Uint8Array(buffer); // See as 16 bytes
const shorts = new Uint16Array(buffer); // See as 8 shorts
const floats = new Float32Array(buffer); // See as 4 floats

bytes[0] = 100; // Change first byte
console.log(floats[0]); // Float value changed too! (garbled)
```

## Benefits

**Memory Efficiency:**

- One allocation instead of multiple
- Perfect memory layout control
- Cache-friendly access patterns

**Performance:**

- WebGL can upload entire buffer at once
- Fewer garbage collection cycles
- Predictable memory usage

## Safety Considerations

```typescript
// DANGER: Writing to overlapping views
const buffer = new ArrayBuffer(8);
const view1 = new Uint8Array(buffer, 0, 4);
const view2 = new Uint32Array(buffer, 0, 2); // Overlaps!

view1[0] = 255;
// view2[0] is now corrupted!

// SAFE: Non-overlapping regions
const safeView1 = new Uint8Array(buffer, 0, 4);
const safeView2 = new Uint8Array(buffer, 4, 4); // No overlap
```

## Memory Layout Pattern

```typescript
// Common voxel chunk layout
function createChunkBuffer() {
  const VOXELS = 16 * 16 * 16;
  const buffer = new ArrayBuffer(
    VOXELS * 1 + // blocks (Uint8)
      VOXELS * 1 + // lighting (Uint8)
      VOXELS * 2 // metadata (Uint16)
  );

  let offset = 0;
  const blocks = new Uint8Array(buffer, offset, VOXELS);
  offset += VOXELS;

  const lighting = new Uint8Array(buffer, offset, VOXELS);
  offset += VOXELS;

  const metadata = new Uint16Array(buffer, offset, VOXELS);

  return { buffer, blocks, lighting, metadata };
}
```
