# Marching Cubes - Quick Reference & Confusion Busters

## The Core Problem

**Voxel worlds look blocky.** You want smooth, realistic terrain from the same voxel data.

## Two Completely Different Approaches

**Without Marching Cubes:**

- Each voxel = one visible cube block
- Result: Minecraft-style blocky world

**With Marching Cubes:**

- Voxels = invisible data points about density/solidity
- Generate smooth triangular surfaces from that data
- Result: Realistic, flowing terrain

## What Is a Voxel?

**Voxel = Volume Pixel** - one 3D data point storing a single value (like "solid" or "empty"). NOT a visible cube!

## What Are the "Cubes"?

**Not actual cube objects.** You examine 8 neighboring voxel points arranged as cube corners:

```
8 voxel points:    Imaginary cube:
●-------●             ●-------●
|       |      →     /|      /|
|       |           ● -------● |
●-------●           | ●-----|-●
                    |/      |/
                    ●-------●
```

## The Algorithm

1. **March through your voxel grid** (nested loops)
2. **For each 2x2x2 group of 8 voxels:**
   - Check which corners are solid/empty
   - Calculate pattern index (0-255)
   - Look up pre-made triangle pattern
   - Add triangles to mesh
3. **Result:** Smooth triangular surface

## Key Confusions Resolved

- **No cubes inside cubes** - just examining 8 neighboring data points
- **Same voxel resolution** - different rendering approach
- **Always 8 corners** - never bigger than 2x2x2 examination window
- **Voxels aren't rendered** - they're just data for generating triangles

## Why 256 Patterns?

8 corners × 2 states each = 2^8 = 256 possible solid/empty combinations. Smart people figured out the triangle patterns for all of them.
