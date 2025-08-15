# Graphics Terminology: From First Principles

## Raster

**Definition**: A grid of pixels (picture elements)

**First Principles**: Your computer screen is literally a rectangular grid of tiny colored dots. Each dot can be set to any color. That grid is a raster.

**Real World Analogy**: Think of a piece of graph paper where you can color each square. The graph paper is your raster, each square is a pixel.

**Key Properties**:

- Has fixed dimensions (width × height)
- Each position in the grid can hold color information
- Resolution = how many pixels fit in a given space

## Rasterization

**Definition**: The process of converting mathematical shapes into colored pixels on a raster

**First Principles**: You have mathematical descriptions (like "triangle with corners at A, B, C") and you need to figure out which pixels in your grid should be colored to make that shape appear.

**The Core Algorithm**:

1. For each pixel in the grid
2. Ask: "Is this pixel inside the shape?"
3. If yes: color it
4. If no: leave it alone (or color it background)

**Real World Analogy**: Like using a stencil on graph paper - the stencil defines the shape mathematically, but you still have to decide which squares to color in.

## Vector Graphics

**Definition**: Graphics defined by mathematical formulas rather than pixels

**First Principles**: Instead of storing "pixel (10,15) is red, pixel (10,16) is red...", you store "circle with center (50,50) and radius 25, colored red"

**Key Advantage**: Infinitely scalable because you're storing the math, not the pixels

**When It Becomes Pixels**: Vector graphics must eventually be rasterized to display on your screen

## Pixel (Picture Element)

**Definition**: The smallest controllable unit of color in a raster

**First Principles**: One tiny square in your grid that can be set to exactly one color at a time

**Physical Reality**: On an LCD screen, this is literally a tiny rectangle with red, green, and blue sub-components

## Resolution

**Definition**: How many pixels fit in a given space or area

**First Principles**: Finer grid = more pixels = more detail possible

**Common Measurements**:

- Total pixels: 1920×1080 = ~2 million pixels total
- Density: 300 DPI = 300 pixels per inch

## Bitmap

**Definition**: A data structure that stores color information for each pixel in a raster

**First Principles**: Literally a map of bits (or bytes) where each entry corresponds to one pixel's color

**File Examples**: PNG, JPEG, GIF files are stored bitmaps

## The Fundamental Process

1. **Create/Define** → Mathematical description of what you want to draw
2. **Rasterize** → Convert math into specific pixel colors
3. **Display** → Show the colored pixels on screen

This is why understanding "raster = grid of pixels" unlocks everything else - it's the target that all graphics operations ultimately aim for.
