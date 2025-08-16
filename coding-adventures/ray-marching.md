# Ray Marching - Quick Reference & Confusion Busters

## The Core Problem

**Your screen is flat 2D, but your world is 3D.** For each pixel, you need to answer: "What color should this pixel show?"

## What Is a Ray?

A straight line from your eye through a pixel into the 3D world. Like a laser pointer beam.

## The Algorithm (Step-by-Step)

1. **Start at camera position**
2. **Calculate distance to nearest surface** (using distance functions)
3. **Step forward by exactly that distance** (safe step - you know you won't hit anything)
4. **Repeat until distance becomes tiny** (you hit something) or give up
5. **Color the pixel** based on what you hit

## Key Insight

You're taking the **biggest safe step possible** every time. Near objects = tiny steps. Far from objects = big steps.

## Distance Functions (SDFs)

Mathematical formulas that tell you "how far am I from the surface?"

- **Sphere:** `length(point) - radius`
- **Positive distance:** outside the shape
- **Negative distance:** inside the shape

## Combining Shapes (Your Math.min/Math.max Confusion)

- **Union (OR):** `Math.min(sphere, cube)` - show either shape
- **Intersection (AND):** `Math.max(sphere, cube)` - only show overlap
- **Subtraction:** `Math.max(sphere, -cube)` - cut hole in sphere

## Why This Works

Instead of complex triangle intersection math, you just ask "how far to nearest surface?" and step safely. GPU does this for millions of pixels in parallel.

## vs Traditional Graphics

- **Traditional:** Model with triangles, calculate intersections
- **Ray marching:** Define with math functions, step until you hit something
