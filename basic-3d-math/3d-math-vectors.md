# 3D Math Vectors - Quick Reference

## Core Vector Type

```typescript
type Vec3 = { x: number; y: number; z: number };
```

## Essential Operations

### Addition (Moving/Offsetting)

```typescript
const add = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z,
});

// Usage: Move player by velocity
const newPos = add(playerPos, velocity);
```

### Subtraction (Finding Direction)

```typescript
const subtract = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z,
});

// Usage: Get direction from player to target
const direction = subtract(target, playerPos);
```

### Length/Distance

```typescript
const length = (v: Vec3): number => {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
};

const distance = (a: Vec3, b: Vec3): number => {
  return length(subtract(a, b));
};

// Usage: Check if player can reach block
const canReach = distance(playerPos, blockPos) <= 6;
```

### Scale (Resize/Speed)

```typescript
const scale = (v: Vec3, factor: number): Vec3 => ({
  x: v.x * factor,
  y: v.y * factor,
  z: v.z * factor,
});

// Usage: Make movement faster
const runSpeed = scale(walkSpeed, 2.5);
```

## Coordinate System

- **X**: left(-) to right(+)
- **Y**: down(-) to up(+)
- **Z**: away(-) to toward(+) camera

## Common Patterns

```typescript
// Move object each frame
object.position = add(object.position, object.velocity);

// Check distance for interaction
if (distance(player, item) < 2) {
  collectItem();
}

// Find direction to target
const moveDirection = subtract(destination, currentPos);
```
