# Mesh Generation & Performance Concepts

## What is a Mesh?

**Mesh = triangles that represent your voxels for the GPU:**

```typescript
// Your chunk data: block types in array
const blocks = new Uint8Array(16 * 16 * 16); // [0,1,1,0,2,1,...]

// GPU needs: actual triangle coordinates
const vertices = new Float32Array(maxVertices * 3); // [x,y,z, x,y,z, ...]
const indices = new Uint16Array(maxIndices); // [0,1,2, 1,3,2, ...]
```

**Think of it as:** Data = blueprint, Mesh = actual building materials

## Why Triangles?

**GPUs only understand triangles:**

- Everything 3D is made of triangles
- Cubes = 12 triangles (6 faces × 2 triangles each)
- Always flat (3 points define a plane)
- Simple, fast math for graphics cards

**A cube face becomes:**

```
Square face:          Two triangles:
A ---- B             A ---- B
|      |      →      |\     |
|      |             | \    |
D ---- C             |  \   |
                     D ---\ C
```

## Why Regeneration is Expensive

**When one block changes, you rebuild the entire chunk's mesh:**

```typescript
// Naive approach - check every voxel position
for (let x = 0; x < 16; x++) {
  for (let y = 0; y < 16; y++) {
    for (let z = 0; z < 16; z++) {
      // 1. Check if block exists here
      // 2. Check all 6 neighbors (visible faces?)
      // 3. Generate triangles for visible faces
      // 4. Add vertices to arrays
    }
  }
}
// That's 4,096 positions × 6 face checks = 24,576 operations!
```

**Why rebuild everything?** One block removal can expose many new faces:

```
Before: [Stone][Stone][Stone]
After:  [Stone][ AIR ][Stone]

Now left stone shows RIGHT face
And right stone shows LEFT face
(Those faces were hidden before!)
```

## Neighbor Checking

**For each block, check 6 directions:**

```typescript
const directions = [
  [-1, 0, 0],
  [1, 0, 0], // Left, Right
  [0, -1, 0],
  [0, 1, 0], // Down, Up
  [0, 0, -1],
  [0, 0, 1], // Back, Front
];

function shouldShowFace(
  x: number,
  y: number,
  z: number,
  direction: number[]
): boolean {
  const neighborX = x + direction[0];
  const neighborY = y + direction[1];
  const neighborZ = z + direction[2];

  // Check neighbor block type
  const neighborBlock = getBlock(neighborX, neighborY, neighborZ);
  return neighborBlock === 0; // Show face if neighbor is air
}
```

## Chunk Boundary Complexity

**Problem: Neighbors might be in different chunks:**

```typescript
function getBlock(x: number, y: number, z: number): number {
  // Within this chunk?
  if (x >= 0 && x < 16 && y >= 0 && y < 16 && z >= 0 && z < 16) {
    const index = x + y * 16 + z * 16 * 16;
    return blocks[index];
  }

  // Outside chunk - need to ask chunk manager
  const worldX = chunkWorldX * 16 + x;
  const worldY = chunkWorldY * 16 + y;
  const worldZ = chunkWorldZ * 16 + z;
  return chunkManager.getBlock(worldX, worldY, worldZ);
}
```

## Optimization Strategies

**1. Incremental Updates (Smart):**

```typescript
// Only check affected area around changed block
function updateMeshIncremental(
  changedX: number,
  changedY: number,
  changedZ: number
) {
  for (let x = changedX - 1; x <= changedX + 1; x++) {
    for (let y = changedY - 1; y <= changedY + 1; y++) {
      for (let z = changedZ - 1; z <= changedZ + 1; z++) {
        // Only 3×3×3 = 27 checks instead of 4,096!
      }
    }
  }
}
```

**2. Dirty Face Tracking (Advanced):**

```typescript
const dirtyFaces = new Set<string>();
dirtyFaces.add("5,8,3,top"); // This block's top face
dirtyFaces.add("5,9,3,bottom"); // Neighbor's bottom face
// Only rebuild these specific faces
```

**3. Chunk Size Optimization:**

- Smaller chunks = faster updates, more management overhead
- Larger chunks = slower updates, less overhead
- Sweet spot: 16³ or 32³

## Memory Considerations

**Pre-allocate for worst case:**

```typescript
// Worst case: every voxel visible (24 vertices per voxel)
const maxVertices = 16 * 16 * 16 * 24;
const positions = new Float32Array(maxVertices * 3);

// Each face = 2 triangles = 6 indices
const maxIndices = 16 * 16 * 16 * 36;
const indices = new Uint16Array(maxIndices);

// Only fill what you actually need
let vertexCount = 0;
let indexCount = 0;
```
