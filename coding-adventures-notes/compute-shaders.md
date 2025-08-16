# Compute Shaders - Quick Reference & Confusion Busters

## The Core Problem

**Sequential processing is slow.** Your CPU processes things one-by-one, but your GPU has thousands of cores that can work simultaneously.

## What Are Compute Shaders?

**Programs that run on your GPU to do massively parallel calculations.** Instead of 4-8 CPU cores doing things sequentially, use 1000+ GPU cores doing the same task simultaneously.

## CPU vs GPU Approach

```typescript
// CPU way (slow)
for (let i = 0; i < 100000; i++) {
  processOneItem(items[i]);
}

// GPU way (fast) - conceptually
runInParallel(processOneItem, items); // All 100k at once
```

## Key Concepts

### Work Groups & Threading

- **Work group:** Logical cluster of threads (like 1024 threads)
- **Thread:** One instance of your compute function
- **Dispatch:** Tell GPU "run this on X total items"

### Why 1024 Group Size?

- Power of 2 (GPU-friendly)
- Sweet spot for most GPUs
- Found through trial and error
- Balances parallelism with memory efficiency

### Memory Types

- **Storage buffers:** GPU can read and write data
- **Uniform buffers:** Send parameters to GPU (like scale values)
- **Staging buffers:** Copy GPU results back to CPU

## The Basic Pattern

```typescript
// 1. Create buffers and send data to GPU
const buffer = createBuffer(data);
shader.setBuffer("input", buffer);

// 2. Dispatch compute shader
const numGroups = Math.ceil(totalItems / groupSize);
shader.dispatch(numGroups, 1, 1);

// 3. Get results back
const results = buffer.getData();
```

## Sebastian's Results

**Erosion simulation:** 43 seconds → 1.5 seconds (28x faster)

## Why So Fast?

- **Memory bandwidth:** GPU moves more data per second
- **Parallel ALUs:** Thousands of arithmetic units vs CPU's ~8
- **Same operation on lots of data:** GPU's specialty

## Your Noise Generator Example

- **CPU version:** Nested loops processing 512×512 pixels sequentially
- **GPU version:** 262,144 threads processing all pixels simultaneously
- **Same algorithm, massively parallel execution**

## When to Use Compute Shaders

- Large amounts of data to process
- Same operation repeated many times
- Mathematical calculations on arrays
- Perfect for: noise generation, physics simulation, image processing

## The Tradeoff

GPU-CPU data transfer is expensive. Only worth it when processing enough data to overcome that cost.
