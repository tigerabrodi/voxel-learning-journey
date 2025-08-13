# Coordinate Systems & Voxel Indexing - Quick Reference

## 3D Coordinate System

```typescript
// Standard (Three.js) coordinates:
// X = left(-) to right(+)
// Y = down(-) to up(+)
// Z = back(-) to front(+) toward camera

const examples = {
  origin: { x: 0, y: 0, z: 0 }, // center
  right: { x: 5, y: 0, z: 0 }, // 5 units right
  up: { x: 0, y: 3, z: 0 }, // 3 units up
  forward: { x: 0, y: 0, z: 2 }, // 2 units toward camera
};
```

## Voxel Storage: 3D → 1D Array

### Memory-Efficient Storage

```typescript
// 16×16×16 chunk = 4,096 blocks = 4KB
const chunkSize = 16;
const voxels = new Uint8Array(16 * 16 * 16);

// Block types: 0=air, 1=stone, 2=dirt, 3=wood, etc.
```

### The Magic Formula

```typescript
const getIndex = (x: number, y: number, z: number): number => {
  return x + y * chunkSize + z * chunkSize * chunkSize;
};

// Why this works:
// x = position in current row
// y * 16 = skip Y complete rows (16 blocks each)
// z * 256 = skip Z complete layers (16×16 = 256 blocks each)
```

### Usage Examples

```typescript
// Set block at (2, 3, 1) to stone
const index = getIndex(2, 3, 1); // = 2 + 48 + 256 = 306
voxels[index] = 1;

// Check block type at (5, 0, 0)
const blockType = voxels[getIndex(5, 0, 0)];
if (blockType === 0) console.log("Air");
if (blockType === 1) console.log("Stone");
```

## Safety Checks

```typescript
const isValidPosition = (x: number, y: number, z: number): boolean => {
  return x >= 0 && x < 16 && y >= 0 && y < 16 && z >= 0 && z < 16;
};

const setBlock = (x: number, y: number, z: number, type: number) => {
  if (isValidPosition(x, y, z)) {
    voxels[getIndex(x, y, z)] = type;
  }
};

// Convert player position to block coordinates
const getBlockPos = (playerPos: Vec3) => ({
  x: Math.floor(playerPos.x),
  y: Math.floor(playerPos.y),
  z: Math.floor(playerPos.z),
});
```

## Memory Stats

- **Uint8Array**: 1 byte per block (0-255 block types)
- **16³ chunk**: 4,096 blocks = 4KB per chunk
- **128MB limit**: Can store ~32,768 chunks in memory
