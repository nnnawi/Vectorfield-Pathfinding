# ⚡ Interactive Vector Field Pathfinding

## 📌 Overview
This repository is an **interactive sandbox** for experimenting with **Vector Field Pathfinding**, a powerful algorithm used in **robotics and video games** for efficient path computation. The visualization is implemented in **HTML, CSS, and JavaScript**, using **p5.js** for an intuitive, interactive experience. 🚀

## 🏆 Key Features
- **Real-time Pathfinding**: Computes the optimal direction for every point on the grid in a **single calculation**.
- **Obstacle Placement**: Draw obstacles dynamically to see how paths adapt. 🧱
- **Customizable Parameters**:
  - **Distance Metrics**: Choose between **Chebyshev, Manhattan, or Euclidean**.
  - **Kernel Functions**: Experiment with **Sobel, Minimum, or custom functions**.
  - **Vector Field Analysis**: Display **Divergence** or **Curl**.
  - **Adjust Kernel Size** for different levels of smoothness.
- **Interactive Visualization**: Modify settings in real-time and see immediate feedback. 🎨

## 🔍 What is Vector Field Pathfinding?
Vector Field Pathfinding is an advanced navigation technique that computes a **flow field** where each point in the grid stores a direction to the target. Unlike traditional A* or Dijkstra’s algorithms, it allows **all agents to follow optimal paths with minimal computation** after an initial calculation.

💡 This method is widely used in **video games** (for AI movement) and **robotics** (for autonomous navigation).

## 🎥 Learn More - Watch the Video!
This project is based on a video I made explaining **Vector Field Pathfinding** in detail. 🎬 Watch it here for a full breakdown of the algorithm and how it works:

[📺 Watch the Video](https://www.youtube.com/watch?v=ZJZu3zLMYAc&t=6s)


## ⚙️ How It Works
1. **Compute a Distance Map**: Determines the shortest distance from every point to the goal using the selected metric.
2. **Generate a Gradient Field**: Computes the best direction at each point using the chosen kernel function.
3. **Display the Flow Field**: Visualizes the pathfinding vectors and allows real-time interaction.

## 📜 License
This project is licensed under the MIT License.

---

🚀 **Explore Vector Field Pathfinding interactively and understand path optimization like never before!** 🧭
