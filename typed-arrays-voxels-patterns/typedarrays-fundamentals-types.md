# TypedArrays Fundamentals & Types

## The 8 Core Types

```typescript
// Integer Types
Uint8Array; // 0 to 255 (1 byte)           → Block types, lighting
Int8Array; // -128 to 127 (1 byte)        → Rarely used
Uint16Array; // 0 to 65,535 (2 bytes)       → Many block types, vertex indices
Int16Array; // -32,768 to 32,767 (2 bytes) → Chunk coordinates
Uint32Array; // 0 to 4+ billion (4 bytes)   → Large indices
Int32Array; // ±2 billion (4 bytes)        → World coordinates

// Float Types
Float32Array; // 32-bit decimals (4 bytes)   → Vertex positions
Float64Array; // 64-bit decimals (8 bytes)   → Rarely used in graphics
```

## Choosing the Right Type

**Rule: Pick smallest type that fits your max value**

```typescript
// Examples for voxel engines:
const blockTypes = new Uint8Array(chunkSize); // 50 block types → Uint8
const vertices = new Float32Array(maxVerts * 3); // Positions need decimals
const indices = new Uint16Array(maxIndices); // Up to 65k vertices
const worldCoords = new Int32Array(3); // Can be negative
```

## Memory Calculations

```typescript
const chunk = new Uint8Array(16 * 16 * 16);
console.log(chunk.length); // 4,096 (elements)
console.log(chunk.byteLength); // 4,096 (bytes, since 1 byte each)

const positions = new Float32Array(1000);
console.log(positions.length); // 1,000 (elements)
console.log(positions.byteLength); // 4,000 (bytes, since 4 bytes each)
```

## Creation Methods

```typescript
// Method 1: From size (filled with zeros)
const empty = new Uint8Array(512);

// Method 2: From array literal
const data = new Float32Array([1.5, 2.0, 3.7]);

// Method 3: From another TypedArray (copies data)
const copy = new Uint8Array(original);

// Method 4: From ArrayBuffer (shared memory)
const buffer = new ArrayBuffer(1024);
const view = new Uint8Array(buffer);
```

## Critical Gotchas

```typescript
// Values get clamped silently!
const blocks = new Uint8Array(10);
blocks[0] = 300; // Becomes 255 (no error!)
blocks[1] = -50; // Becomes 0

// Out of bounds = undefined (no error!)
const small = new Uint8Array(5);
small[100] = 1; // Does nothing
console.log(small[100]); // undefined
```
