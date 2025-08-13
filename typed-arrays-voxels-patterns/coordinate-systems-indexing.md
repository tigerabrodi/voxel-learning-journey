# 3D Coordinate Systems & Indexing

## The Essential Formula

**Convert 3D coordinates to 1D array index:**

```typescript
function coordToIndex(
  x: number,
  y: number,
  z: number,
  width: number,
  height: number
): number {
  return x + y * width + z * width * height;
}

// 16×16×16 chunk example:
const index = coordToIndex(5, 10, 3, 16, 16);
// = 5 + 10*16 + 3*16*16 = 5 + 160 + 768 = 933

const blocks = new Uint8Array(16 * 16 * 16);
blocks[index] = 1; // Set block at (5,10,3) to stone
```

## Memory Layout Logic

**Think layer by layer:**

```
z=0 layer: [all y=0 row, all y=1 row, ..., all y=15 row]
z=1 layer: [all y=0 row, all y=1 row, ..., all y=15 row]
...
z=15 layer: [all y=0 row, all y=1 row, ..., all y=15 row]
```

**Index breakdown:**

- `x` = position within current row
- `y * width` = skip complete rows
- `z * width * height` = skip complete layers

## Chunk Concepts

**Chunk = manageable piece of world:**

```typescript
// Instead of one massive array:
const world = new Uint8Array(10000 * 10000 * 256); // 25 GB!

// Break into chunks:
const chunk1 = new Uint8Array(16 * 16 * 16); // 4 KB
const chunk2 = new Uint8Array(32 * 32 * 32); // 32 KB
```

## Chunk Size Trade-offs

| Size | Memory per chunk | Updates | Management   |
| ---- | ---------------- | ------- | ------------ |
| 8³   | 512 bytes        | Fast    | Many chunks  |
| 16³  | 4 KB             | Good    | Balanced     |
| 32³  | 32 KB            | Slower  | Fewer chunks |
| 64³  | 262 KB           | Slow    | Very few     |

**Sweet spot: 16³ or 32³ for most games**

## World vs Local Coordinates

**World coordinates = continuous across chunks:**

```typescript
// Player at world position (23, 5, 67)
// This spans multiple chunks!
```

**Local coordinates = within single chunk:**

```typescript
// World (23, 5, 67) converts to:
// Chunk (1, 0, 4) at local position (7, 5, 3)

function worldToChunk(worldX: number) {
  const chunkX = Math.floor(worldX / 16); // Which chunk
  const localX = worldX % 16; // Position in chunk
  return { chunkX, localX };
}
```

## Boundary Handling

**Problem: Checking neighbors at chunk edges:**

```typescript
// At chunk boundary (x=15), right neighbor is in next chunk
function getNeighborBlock(
  x: number,
  y: number,
  z: number,
  chunkManager: ChunkManager
): number {
  if (x < 0 || x >= 16 || y < 0 || y >= 16 || z < 0 || z >= 16) {
    // Convert to world coordinates and ask chunk manager
    const worldX = thisChunk.worldX * 16 + x;
    const worldY = thisChunk.worldY * 16 + y;
    const worldZ = thisChunk.worldZ * 16 + z;
    return chunkManager.getBlock(worldX, worldY, worldZ);
  }

  // Normal case: within this chunk
  const index = coordToIndex(x, y, z, 16, 16);
  return thisChunk.blocks[index];
}
```

## Common Access Patterns

```typescript
// Get block at coordinate
function getBlock(x: number, y: number, z: number): number {
  const index = x + y * 16 + z * 16 * 16;
  return blocks[index];
}

// Set block at coordinate
function setBlock(x: number, y: number, z: number, blockType: number): void {
  const index = x + y * 16 + z * 16 * 16;
  blocks[index] = blockType;
}

// Check if coordinates are valid
function isValidCoord(x: number, y: number, z: number): boolean {
  return x >= 0 && x < 16 && y >= 0 && y < 16 && z >= 0 && z < 16;
}
```
