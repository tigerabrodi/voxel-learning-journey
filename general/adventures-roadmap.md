what im going through here:

```


MX

Hoppa över navigeringen
Sök




Skapa

9+

Avatarbild
Hem
YouTube Music
Ditt YouTube
Historik
Spellistor
Dina videor
Dina kurser
Titta senare
Videor du gillat
Nedladdningar
Dina klipp
Inställningar
Rapporthistorik
Hjälp
Skicka feedback
OmPressUpphovsrättKontakta ossKreatörerAnnonseraUtvecklare
VillkorIntegritetPolicy och säkerhetSå fungerar YouTubeTesta nya funktioner
© 2025 Google LLC

Spela upp alla
Spela upp alla
Coding Adventures

från Sebastian Lague
Spellista
•
26 videor
•
1 145 097 visningar
Going on an adventure to learn new things and create cool stuff in the world of programming.
Spela upp alla



1

41:18
Spelas nu
Coding Adventure: Ray-Tracing Glass and Caustics
Sebastian Lague
•
223 894 visningar • för 1 månad sedan

2

50:09
Spelas nu
Coding Adventure: Software Rasterizer
Sebastian Lague
•
483 101 visningar • för 4 månader sedan

3

27:23
Spelas nu
Coding Adventure: Planetary Fluid Sim
Sebastian Lague
•
802 910 visningar • för 8 månader sedan

4

58:41
Spelas nu
Coding Adventure: Rendering Fluids
Sebastian Lague
•
810 533 visningar • för 10 månader sedan

5

43:31
Spelas nu
Coding Adventure: Sound (and the Fourier Transform)
Sebastian Lague
•
629 213 visningar • för 1 år sedan

6

52:13
Spelas nu
Coding Adventure: More Ray Tracing!
Sebastian Lague
•
632 534 visningar • för 1 år sedan

7

1:10:54
Spelas nu
Coding Adventure: Rendering Text
Sebastian Lague
•
1 mn visningar • för 1 år sedan

8

47:52
Spelas nu
Coding Adventure: Simulating Fluids
Sebastian Lague
•
2,3 mn visningar • för 1 år sedan

9

1:01:01
Spelas nu
Coding Adventure: Making a Better Chess Bot
Sebastian Lague
•
1,1 mn visningar • för 2 år sedan

10

37:58
Spelas nu
Coding Adventure: Ray Tracing
Sebastian Lague
•
1,4 mn visningar • för 2 år sedan

11

22:23
Spelas nu
Coding Adventure: Terraforming
Sebastian Lague
•
1,6 mn visningar • för 4 år sedan

12

17:54
Spelas nu
Coding Adventure: Ant and Slime Simulations
Sebastian Lague
•
2,1 mn visningar • för 4 år sedan

13

29:22
Spelas nu
Coding Adventure: Chess
Sebastian Lague
•
4,1 mn visningar • för 4 år sedan

14

22:00
Spelas nu
Coding Adventure: Atmosphere
Sebastian Lague
•
1,2 mn visningar • för 5 år sedan

15

22:48
Spelas nu
Coding Adventure: Procedural Moons and Planets
Sebastian Lague
•
1,9 mn visningar • för 5 år sedan

16

12:12
Spelas nu
Coding Adventure: Solar System
Sebastian Lague
•
942 974 visningar • för 5 år sedan

17

16:06
Spelas nu
Coding Adventure: Portals
Sebastian Lague
•
1,4 mn visningar • för 5 år sedan

18

9:25
Spelas nu
Coding Adventure: Game Idea Generator
Sebastian Lague
•
901 966 visningar • för 5 år sedan

19

12:50
Spelas nu
Coding Adventure: Clouds
Sebastian Lague
•
1,3 mn visningar • för 5 år sedan

20

8:35
Spelas nu
Coding Adventure: Boids
Sebastian Lague
•
1,6 mn visningar • för 6 år sedan

21

4:38
Spelas nu
Coding Adventure: Coding a Coding Game
Sebastian Lague
•
624 355 visningar • för 6 år sedan

22

6:40
Spelas nu
Coding Adventure: Simulating an Ecosystem
Sebastian Lague
•
2,3 mn visningar • för 6 år sedan

23

6:18
Spelas nu
Coding Adventure: Marching Cubes
Sebastian Lague
•
1 mn visningar • för 6 år sedan

24

5:06
Spelas nu
Coding Adventure: Ray Marching
Sebastian Lague
•
1,1 mn visningar • för 6 år sedan

25

5:25
Spelas nu
Coding Adventure: Compute Shaders
Sebastian Lague
•
837 261 visningar • för 6 år sedan

26

5:19
Spelas nu
Coding Adventure: Hydraulic Erosion
Sebastian Lague
•
935 088 visningar • för 6 år sedan
```

what ill be building as im studying this:

```
Perfect — that’s *exactly* the right mindset. You don’t want to just “watch in order,” you want to **evolve one single project** through the *conceptual sequence* of Lague’s videos — layering new systems, shaders, and simulations as you go.

Let’s do this properly.

---

# 🧭 The *Sebastian Lague Coding Adventure → One Project* Roadmap

## 🎯 Goal

You’ll build one continuous thing — a **procedural simulation world** that grows in complexity with every video you watch.
Think of it like your own “tiny universe” built from scratch in **Three.js** — starting as a visual shader test, turning into a living world, and eventually gaining physics, AI, terrain, fluids, and ray tracing.

Each step below tells you:

1. 🎥 which Lague video(s) to watch,
2. 🧱 what to build next into the *same* project.

---

## 🧩 **Phase 1 – Core Simulation and Visual Foundations**

> Theme: learn rendering, shader logic, and procedural motion

### 🎥 Watch:

* **Ray Marching**
* **Marching Cubes**
* **Compute Shaders**

### 🧱 Build:

* A **Three.js scene** with a shader playground.
* Implement a **signed-distance-field (SDF)** raymarcher in a fragment shader.
* Replace it with a **voxel terrain** using marching cubes (isosurface).
* Integrate a **GPUComputationRenderer** setup — this becomes your “simulation engine.”

🧠 *Goal:* understand how data moves on the GPU and how 3D shapes emerge from math.

---

## 🌿 **Phase 2 – Procedural Nature**

> Theme: create life and natural environments inside your world

### 🎥 Watch:

* **Boids**
* **Simulating an Ecosystem**
* **Hydraulic Erosion**

### 🧱 Build:

* Add **boid agents** that fly or swim in your world.
* Give them **ecosystem rules** (eat plants, avoid predators, reproduce).
* Add a **terrain heightmap** (procedurally generated with noise).
* Apply **erosion simulation** to shape it dynamically.

🧠 *Goal:* your world now has geography and simple life — everything reacts over time.

---

## 🌍 **Phase 3 – Planets and Atmospheres**

> Theme: procedural generation at planetary scale

### 🎥 Watch:

* **Solar System**
* **Procedural Moons and Planets**
* **Atmosphere**

### 🧱 Build:

* Wrap your simulation terrain onto a **sphere** (planet mode).
* Add **procedural planet materials** (biomes via noise).
* Implement a **simple atmosphere shader** with light scattering.
* Optional: add a **sun + orbital camera system**.

🧠 *Goal:* your sandbox evolves into a full-fledged procedural planet with sky and terrain.

---

## 🧠 **Phase 4 – Agents, AI, and Logic**

> Theme: intelligence and behavior in your simulation

### 🎥 Watch:

* **Chess**
* **Ant and Slime Simulations**
* **Terraforming**

### 🧱 Build:

* Add **AI agents** that explore or modify the world.
  e.g., Slime-like agents that follow gradients or modify terrain (terraforming).
* Create simple **pathfinding or cellular automata** logic.
* Visualize agent trails, pheromones, or terrain changes over time.

🧠 *Goal:* your world now *thinks* — it has living entities interacting with the environment.

---

## 💧 **Phase 5 – Fluids and Dynamic Matter**

> Theme: add real physics and continuous simulation

### 🎥 Watch:

* **Simulating Fluids**
* **Rendering Fluids**
* **Planetary Fluid Sim**

### 🧱 Build:

* Simulate **2D fluids** over your terrain (for rivers, oceans, rain).
* Expand to **3D volumetric fluids** with particles or grid-based density.
* Integrate with your **terrain erosion** to make water affect land.
* Optionally render water with **refraction & reflection** shaders.

🧠 *Goal:* your world now has living systems *and* physical simulation — terrain, water, and motion all connect.

---

## 🌈 **Phase 6 – Rendering and Light**

> Theme: advanced lighting, reflection, and realism

### 🎥 Watch:

* **Ray Tracing**
* **More Ray Tracing**
* **Ray-Tracing Glass and Caustics**
* **Rendering Text**

### 🧱 Build:

* Add **ray-marched reflections** or **screen-space reflections** in Three.js.
* Create **refractive glass-like materials** (use cube maps or refraction shaders).
* Add **text rendering** or **UI overlays** in 3D space.
* Maybe use **caustics approximation** for light interacting with water or glass.

🧠 *Goal:* your world becomes visually beautiful and technically advanced — real reflections, light effects, readable surfaces.

---

## 🔊 **Phase 7 – Sound and Final Polish**

> Theme: sensory depth and creative output

### 🎥 Watch:

* **Sound (and the Fourier Transform)**

### 🧱 Build:

* Add **audio-reactive elements**: make terrain, particles, or lighting react to sound input.
* Tie it all together into a **“living world demo”** — camera orbiting, transitions, and ambient sound.

🧠 *Goal:* you’ve now got a procedural, audio-reactive simulation world — emergent, physical, and visually dynamic.

---

## 🚀 Final Project Outcome

By the end:

* You’ll have a **Three.js “Living Planet” simulation**
  → procedural terrain, erosion, fluids, AI agents, ray-traced reflections, sound-reactive shaders.
* Everything evolved step-by-step with each video’s concept layered in.

---

## ✅ Suggested Flow (1 project, 1 build after each video)

| Step | Watch                 | Add to Project   | Concept                  |
| ---- | --------------------- | ---------------- | ------------------------ |
| 1    | Ray Marching          | SDF Renderer     | Shaders                  |
| 2    | Marching Cubes        | Terrain          | Geometry                 |
| 3    | Compute Shaders       | GPU Simulation   | Parallel compute         |
| 4    | Boids                 | Agents           | Movement & behavior      |
| 5    | Ecosystem             | Life cycle       | Emergence                |
| 6    | Erosion               | Terrain update   | Natural systems          |
| 7    | Planets + Atmosphere  | Planet world     | Procedural scale         |
| 8    | Slime Sim / Terraform | World AI         | Environment modification |
| 9    | Fluids                | Water physics    | Continuum simulation     |
| 10   | Ray Tracing           | Lighting         | Visual fidelity          |
| 11   | Sound                 | Audio reactivity | Sensory depth            |

---

Would you like me to turn this into a **trackable roadmap (Markdown or Notion-style checklist)** that you can literally follow — with boxes, links, and short “what to build” tasks under each video?
```
