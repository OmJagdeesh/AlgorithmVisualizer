import { $, $$ } from './dom.js';
import { state } from './state.js';
import { setStatus, updateAlgorithmInfo, resetAll } from './ui.js';
import { runAlgorithm } from './algorithms/index.js';

export function handleArrayInput(e) {
  const input = e.target.value.trim();
  if (!input) return;
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
  state.array = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
  const inputEl = $("#arrayInput");
  if (inputEl) inputEl.value = state.array.join(", ");
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
