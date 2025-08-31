# Origin Shifting & Coordinate Systems - Complete Guide

## The Fundamental Computer Problem

### Why Coordinate Systems Matter

Computers can only work with specific numbers. They can't handle "over there" or "near that thing" - everything must be exact coordinates like [x, y, z].

When you create a 3D world, you're forced to choose where to put [0,0,0]. This choice has consequences you don't expect.

### The Floating Point Precision Problem

Computers store decimal numbers using 32-bit floats with ~7 significant digits of precision.

**Examples:**

- `1.0000001` → Stored accurately
- `50000.0000001` → Rounded to `50000.0` (precision lost)

**The Death Spiral:**

1. Player walks to [1,000,000, 0, 0]
2. Player tries to move 0.1 units forward
3. Computer rounds [1,000,000.1, 0, 0] back to [1,000,000, 0, 0]
4. Player appears stuck or moves in jerky steps
5. Physics breaks, rendering artifacts appear
6. Game becomes unplayable

## Sebastian's Solar System Lessons for Voxel Engines

### Multiple Objects in 3D Space

**Sebastian's Problem:** Multiple planets, moons, ship positions
**Your Problem:** Multiple chunks at different positions

Both need:

- Track positions of multiple objects
- Add/remove objects dynamically
- Process objects based on distance from player

### Distance-Based Decisions

**Sebastian's Approach:** Only calculate gravity for nearby planets
**Your Approach:** Only load chunks within radius of player

**Practical Implementation:**

- Calculate distance from player to potential chunk positions
- Load chunks within radius (e.g., 8 chunks in each direction)
- Unload chunks beyond radius for performance

### Chunk Coordinates Explained

Your infinite voxel world is divided into 16x16x16 cubes called chunks.

**Chunk coordinate system:**

- Chunk [0,0,0] = world positions 0-15 on each axis
- Chunk [1,0,0] = world positions 16-31 on x-axis, 0-15 on y,z
- Chunk [-1,0,0] = world positions -16 to -1 on x-axis, 0-15 on y,z

**Chunk Properties:**

- Voxel data (which of 4096 positions contain dirt/stone/air)
- Mesh data (triangles from marching cubes)
- Generation state (has this chunk been created?)

## Origin Shifting - The Solution

### Why Reference Frames Are Fundamental

Every calculation happens relative to your chosen [0,0,0] point. Matrix transformations, distances, collisions - everything assumes this choice.

Most people think: "I chose [0,0,0], now I'm stuck with it forever."
**Reality:** You can change your mind anytime during the program.

### The Mental Model

Imagine drawing a map on paper with a dot labeled "origin." You can pick up the paper and slide it around. All relationships between objects stay the same, but your "origin" dot is now elsewhere.

That's origin shifting - sliding the entire coordinate system while preserving relationships.

### How Origin Shifting Works

**Before Shift:**

- Player: [50000, 0, 0] (bad precision)
- Planet A: [52000, 0, 0]
- Planet B: [48000, 0, 0]

**The Shift Process:**

1. Calculate offset needed: [-50000, 0, 0]
2. Apply offset to EVERYTHING:
   - Player: [50000, 0, 0] + [-50000, 0, 0] = [0, 0, 0]
   - Planet A: [52000, 0, 0] + [-50000, 0, 0] = [2000, 0, 0]
   - Planet B: [48000, 0, 0] + [-50000, 0, 0] = [-2000, 0, 0]

**After Shift:**

- Player: [0, 0, 0] (good precision restored)
- All distances preserved (Player to Planet A still 2000 units)
- All calculations now happen near origin

### When Origin Shifting Happens

**NOT continuously** - it happens in discrete jumps when player gets too far from [0,0,0].

**Timeline:**

1. Player walks normally: [0,0,0] → [1000,0,0] → [2000,0,0] → ... → [50000,0,0]
2. System detects: "Player too far from origin"
3. System shifts everything once: Reset coordinate system
4. Player continues walking normally from new [0,0,0]

### Why Periodic Shifting Is Enough

You don't need perfect precision everywhere - just good precision near the player where action happens.

Sebastian's threshold (1000 units from origin) gives buffer before precision becomes problematic.

## Key Clarifications

### "Do We Move Everything AND The Player?"

No. The player gets moved once as part of "everything." There's no separate player movement.

### "Do We Keep Moving Everything Around The Player?"

No. We occasionally reset the coordinate system when the player gets too far out. The origin becomes a moving reference point.

### "What If We Never Do Origin Shifting?"

The game eventually breaks completely:

- Movement becomes impossible (small movements rounded away)
- Physics fails (collision detection, forces become zero)
- Rendering artifacts (flickering, shaking objects)
- Player gets stuck and can't move

## The Universal Solution

This isn't a game development hack - it's the solution to a fundamental computer arithmetic limitation. Every large 3D world (flight sims, space games, open worlds) uses this technique.

**The Insight:** Instead of fighting computer arithmetic limitations, work with them. Keep important calculations in the "sweet spot" where precision is good, and move that sweet spot around as needed.

## For Your Voxel Engine

**Implementation Strategy:**

1. **Update step:** Determine which chunks should be loaded based on player position
2. **Generation step:** Only generate/update chunks that are loaded
3. **Render step:** Only render chunks that are visible
4. **Origin shift:** When player gets too far from [0,0,0], shift entire coordinate system

**Two Coordinate Systems:**

- **World coordinates:** True position in infinite world
- **Local coordinates:** Position relative to current origin (used for rendering/physics)

Origin shifting keeps your chunk loading, world generation, and rendering all working in the high-precision zone near [0,0,0].
