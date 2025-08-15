# Hydraulic Erosion - Quick Reference

## What It Is

Computer simulation of how water carves and shapes terrain over time, mimicking real natural processes.

## The Process (Chronological)

1. **Water appears** - Rain falls or water is placed at high elevations
2. **Water flows downhill** - Follows gravity, finds steepest path down
3. **Water picks up sediment** - Moving water grabs dirt, sand, rocks (faster = more carrying capacity)
4. **Water deposits sediment** - When water slows down, it drops what it's carrying
5. **Terrain reshapes** - Repeated cycles create realistic valleys, ridges, deposits

## The Algorithm (Sebastian's Approach)

1. Drop water at random point on height map
2. Water flows downhill, picks up sediment based on speed
3. When water slows down, deposits sediment back
4. Repeat thousands of times (Sebastian used 70,000 droplets)

## Key Physical Constraint

Water flowing between two height points can't erode more than the height difference between them - prevents unrealistic spikes and pits.

## Why Use It

Transforms boring random terrain noise into natural-looking landscapes that appear shaped by real forces.

## Voxel Engine Connection

Could work on voxel terrain instead of height maps to create caves and overhangs (which height maps can't represent).
