# Basic 3D Transformations - Quick Reference

## 1. Translation (Moving Objects)

**Concept:** Moving by adding an offset vector

```typescript
// Move object by offset
const translate = (position: Vec3, offset: Vec3): Vec3 => {
  return add(position, offset); // Just vector addition!
};

// Examples:
const playerPos = { x: 5, y: 2, z: 10 };
const moveForward = { x: 0, y: 0, z: 1 };
const newPos = translate(playerPos, moveForward); // { x: 5, y: 2, z: 11 }

// Place block relative to player
const blockPos = translate(playerPos, { x: 0, y: 0, z: 2 });
```

## 2. Scale (Resizing Objects)

**Concept:** Multiply all coordinates by same factor

```typescript
const scale = (v: Vec3, factor: number): Vec3 => ({
  x: v.x * factor,
  y: v.y * factor,
  z: v.z * factor,
});

// Scale factors:
// > 1.0 = bigger (1.5 = 50% larger)
// < 1.0 = smaller (0.5 = half size)
// < 0 = flipped direction

// Examples:
const building = { x: 10, y: 20, z: 15 };
const biggerBuilding = scale(building, 1.2); // { x: 12, y: 24, z: 18 }
const smallerBuilding = scale(building, 0.8); // { x: 8, y: 16, z: 12 }

// Scale movement speed
const walkSpeed = { x: 1, y: 0, z: 1 };
const runSpeed = scale(walkSpeed, 2.5); // { x: 2.5, y: 0, z: 2.5 }
```

## 3. Rotation (Use Libraries!)

**Concept:** Spin around an axis (complex math - use libraries)

```typescript
// Counter-intuitive naming:
rotateY(angle); // Spins LEFT/RIGHT (around vertical Y axis)
rotateX(angle); // Spins UP/DOWN (around horizontal X axis)
rotateZ(angle); // Spins CLOCKWISE (around depth Z axis)

// Voxel camera example:
player.rotationY += mouseDeltaX; // Look left/right
player.rotationX += mouseDeltaY; // Look up/down
```

## 4. Combining Transformations

**CRITICAL:** Order matters!

```typescript
// Example: Scale then translate vs translate then scale
const pos = { x: 2, y: 0, z: 0 };

// Method A: Scale first, then move
let resultA = scale(pos, 2); // { x: 4, y: 0, z: 0 }
resultA = translate(resultA, { x: 1, y: 0, z: 0 }); // { x: 5, y: 0, z: 0 }

// Method B: Move first, then scale
let resultB = translate(pos, { x: 1, y: 0, z: 0 }); // { x: 3, y: 0, z: 0 }
resultB = scale(resultB, 2); // { x: 6, y: 0, z: 0 }

// Different results: { x: 5 } vs { x: 6 }
```

## Common Voxel Patterns

```typescript
// Animate moving, spinning block
let blockPos = originalPosition;
blockPos = rotate(blockPos, time * 0.1); // Spin
blockPos = translate(blockPos, velocity); // Move

// Player movement with look direction
let movement = { x: 0, y: 0, z: speed }; // Forward
movement = rotate(movement, playerRotation); // Apply look direction
playerPos = translate(playerPos, movement); // Move player
```

## Reality Check

- **Translation/Scale:** Easy to implement yourself
- **Rotation:** Use a math library (Three.js, gl-matrix, etc.)
- **Matrices:** Libraries handle the complex combination math
