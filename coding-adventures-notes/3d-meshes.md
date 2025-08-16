# 3D Meshes - Quick Reference & Confusion Busters

## What Is a Mesh?

**A collection of triangles connected together to form a 3D shape.** Like a paper sculpture made from triangular pieces taped edge-to-edge.

## Why Triangles?

- **GPUs are optimized for triangles** - fastest to render
- **Any 3D surface can be approximated** with enough small triangles
- **Three points always form a flat plane** - never warped geometry

## Examples

- **Sphere mesh:** ~1,000 triangles arranged in ball shape
- **Character model:** ~10,000 triangles forming a person
- **Terrain mesh:** ~100,000 triangles creating landscape
- **Building:** ~5,000 triangles making walls/roof

## Individual Triangle vs Mesh

```
Single triangles:     /\  /\  /\
                     /  \/  \/  \

Connected mesh:      ████████████
                    ████████████  ← Smooth 3D object
                    ████████████
```

## Mesh Components

- **Vertices:** 3D points (corners of triangles)
- **Faces/Triangles:** Groups of 3 vertices
- **Edges:** Lines connecting vertices
- **Normals:** Direction each triangle faces (for lighting)

## How Marching Cubes Creates Meshes

1. **Analyzes voxel data** (solid/empty patterns)
2. **Generates triangle vertices** at cube edges
3. **Connects vertices into triangles** using lookup tables
4. **Result:** Smooth mesh representing the voxel surface

## Mesh vs Other 3D Representations

- **Voxels:** 3D pixels (blocky)
- **Point clouds:** Just dots in space
- **Meshes:** Connected triangular surfaces (smooth, GPU-friendly)

## Key Insight

**Meshes are the "language" GPUs speak best.** Everything in modern 3D graphics gets converted to triangular meshes for rendering.
