# TypeScript Patterns & Best Practices

## Generic TypedArray Functions

**Instead of writing separate functions for each type:**

```typescript
// Bad - repetitive
function copyUint8Array(source: Uint8Array, dest: Uint8Array, count: number) { ... }
function copyUint16Array(source: Uint16Array, dest: Uint16Array, count: number) { ... }

// Good - generic
type TypedArray = Uint8Array | Uint16Array | Uint32Array | Float32Array;

function copyTypedArray<T extends TypedArray>(source: T, dest: T, count: number): void {
  for (let i = 0; i < count; i++) {
    dest[i] = source[i];
  }
}

// Usage
copyTypedArray(sourceBlocks, destBlocks, 1000);
copyTypedArray(sourceVertices, destVertices, 500);
```

## Type-Safe Array Creation

**Automatically choose the right array type:**

```typescript
type VoxelArrayType = Uint8Array | Uint16Array;

function createVoxelArray(blockTypes: number, size: number): VoxelArrayType {
  if (blockTypes <= 255) {
    return new Uint8Array(size);
  } else if (blockTypes <= 65535) {
    return new Uint16Array(size);
  } else {
    throw new Error(`Too many block types: ${blockTypes}`);
  }
}

// Usage
const blocks = createVoxelArray(150, 16 * 16 * 16); // Returns Uint8Array
const manyBlocks = createVoxelArray(1000, 16 * 16 * 16); // Returns Uint16Array
```

## Memory Pooling Pattern

**Reuse arrays to avoid garbage collection:**

```typescript
class TypedArrayPool<T extends TypedArray> {
  private pool: T[] = [];
  private createFn: (size: number) => T;

  constructor(createFn: (size: number) => T) {
    this.createFn = createFn;
  }

  get(size: number): T {
    // Try to reuse from pool
    const pooled = this.pool.pop();
    if (pooled && pooled.length === size) {
      pooled.fill(0); // Clear old data
      return pooled;
    }

    // Create new if none available
    return this.createFn(size);
  }

  release(array: T): void {
    if (this.pool.length < 10) {
      // Limit pool size
      this.pool.push(array);
    }
  }
}

// Usage
const uint8Pool = new TypedArrayPool((size) => new Uint8Array(size));
const vertexPool = new TypedArrayPool((size) => new Float32Array(size));

const tempArray = uint8Pool.get(1024);
// ... use array ...
uint8Pool.release(tempArray);
```

## Chunk Data Wrapper

**Type-safe chunk management:**

```typescript
interface ChunkData {
  blocks: Uint8Array;
  lighting: Uint8Array;
  metadata: Uint16Array;
  buffer: ArrayBuffer;
}

class Chunk {
  private data: ChunkData;
  readonly size: number;

  constructor(size: number = 16) {
    this.size = size;
    this.data = this.createChunkData(size);
  }

  private createChunkData(size: number): ChunkData {
    const voxelCount = size * size * size;
    const buffer = new ArrayBuffer(
      voxelCount * 1 + // blocks (Uint8)
        voxelCount * 1 + // lighting (Uint8)
        voxelCount * 2 // metadata (Uint16)
    );

    let offset = 0;
    const blocks = new Uint8Array(buffer, offset, voxelCount);
    offset += voxelCount;

    const lighting = new Uint8Array(buffer, offset, voxelCount);
    offset += voxelCount;

    const metadata = new Uint16Array(buffer, offset, voxelCount);

    return { blocks, lighting, metadata, buffer };
  }

  getBlock(x: number, y: number, z: number): number {
    const index = x + y * this.size + z * this.size * this.size;
    return this.data.blocks[index];
  }

  setBlock(x: number, y: number, z: number, blockType: number): void {
    const index = x + y * this.size + z * this.size * this.size;
    this.data.blocks[index] = blockType;
  }

  // Get raw buffer for WebGL upload
  getBuffer(): ArrayBuffer {
    return this.data.buffer;
  }
}
```

## Utility Functions

**Common helpers you'll need:**

```typescript
// Bounds checking
function isValidCoord(x: number, y: number, z: number, size: number): boolean {
  return x >= 0 && x < size && y >= 0 && y < size && z >= 0 && z < size;
}

// Safe array access
function safeArraySet<T extends TypedArray>(
  array: T,
  index: number,
  value: number
): void {
  if (index < 0 || index >= array.length) {
    throw new Error(
      `Index ${index} out of bounds for array length ${array.length}`
    );
  }
  array[index] = value;
}

// Array statistics
function getArrayStats(array: TypedArray): {
  min: number;
  max: number;
  avg: number;
} {
  let min = Infinity,
    max = -Infinity,
    sum = 0;

  for (let i = 0; i < array.length; i++) {
    const val = array[i];
    if (val < min) min = val;
    if (val > max) max = val;
    sum += val;
  }

  return { min, max, avg: sum / array.length };
}
```

## Type Guards

**Runtime type checking:**

```typescript
function isTypedArray(value: unknown): value is TypedArray {
  return (
    value instanceof Uint8Array ||
    value instanceof Uint16Array ||
    value instanceof Uint32Array ||
    value instanceof Float32Array ||
    value instanceof Float64Array ||
    value instanceof Int8Array ||
    value instanceof Int16Array ||
    value instanceof Int32Array
  );
}

function assertTypedArray(value: unknown): asserts value is TypedArray {
  if (!isTypedArray(value)) {
    throw new Error("Expected TypedArray");
  }
}
```
