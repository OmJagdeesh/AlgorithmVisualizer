import { $, $$ } from './dom.js';
import { state } from './state.js';
import { setStatus, updateAlgorithmInfo, resetAll } from './ui.js';
import { runAlgorithm } from './algorithms/index.js';

export function generateRandomGraph(n) {
  state.graphEdges = [];
  // Randomly connect nodes to ensure graph is connected
  for (let i = 1; i < n; i++) {
    // Connect each node to a random previous node to ensure it's a connected component
    const target = Math.floor(Math.random() * i);
    state.graphEdges.push({ u: i, v: target, weight: Math.floor(Math.random() * 20) + 1 });
  }
  
  // Add some extra random edges
  const extraEdges = Math.floor(n * 1.5);
  for (let i = 0; i < extraEdges; i++) {
    const u = Math.floor(Math.random() * n);
    const v = Math.floor(Math.random() * n);
    if (u !== v && !state.graphEdges.some(e => (e.u === u && e.v === v) || (e.u === v && e.v === u))) {
      state.graphEdges.push({ u, v, weight: Math.floor(Math.random() * 20) + 1 });
    }
  }
}

export function handleArrayInput(e) {
  const input = e.target.value.trim();
  if (!input) return;

  if (state.currentAlgorithm === "dijkstra") {
    const n = parseInt(input);
    if (!isNaN(n) && n >= 3 && n <= 20) {
      state.array = Array.from({ length: n }, (_, i) => i);
      generateRandomGraph(n);
      resetAll();
    } else {
      alert("Please enter a number between 3 and 20 for Dijkstra's nodes.");
    }
    return;
  }

  const nums = input
    .split(",")
    .map((n) => parseInt(n.trim()))
    .filter((n) => !isNaN(n));
  if (nums.length > 0) {
    state.array = nums.slice(0, 15);
    resetAll();
  }
}

export function generateRandomArray() {
  const size = Math.floor(Math.random() * 8) + 8;
  if (state.currentAlgorithm === "dijkstra") {
    state.array = Array.from({ length: size }, (_, i) => i);
    generateRandomGraph(size);
    const inputEl = $("#arrayInput");
    if (inputEl) inputEl.value = size;
  } else {
    state.array = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
    const inputEl = $("#arrayInput");
    if (inputEl) inputEl.value = state.array.join(", ");
  }
  resetAll();
}

export function handleSpeedChange(e) {
  state.animationSpeed = 2100 - e.target.value;
  const speedValEl = $("#speedValue");
  if (speedValEl) speedValEl.textContent = (state.animationSpeed / 1000).toFixed(1) + "s";
}

export function startAnimation() {
  if (state.isAnimating) return;
  state.isAnimating = true;
  state.isPaused = false;
  const startBtn = $("#startBtn");
  if (startBtn) startBtn.disabled = true;
  setStatus("Running...", "warning");

  runAlgorithm(state.currentAlgorithm);
}

export function pauseAnimation() {
  state.isPaused = !state.isPaused;
  const pauseBtn = $("#pauseBtn");
  if (pauseBtn) pauseBtn.textContent = state.isPaused ? "▶ Resume" : "⏸ Pause";
  setStatus(state.isPaused ? "Paused" : "Running", "warning");
}
