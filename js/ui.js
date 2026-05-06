import { $, $$ } from './dom.js';
import { state, algorithmInfo } from './state.js';
import { renderArray } from './visualizer.js';

export function createParticles(count = 20) {
  const container = $("#particles");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = (Math.random() * 100).toFixed(2) + "%";
    p.style.top = (Math.random() * 100).toFixed(2) + "%";
    const size = (Math.random() * 12 + 4).toFixed(0) + "px";
    p.style.width = size;
    p.style.height = size;
    p.style.background = `radial-gradient(circle, rgba(255,255,255,${(Math.random() * 0.5 + 0.2).toFixed(2)}), transparent)`;
    p.style.animationDelay = (Math.random() * 20).toFixed(2) + "s";
    p.style.animationDuration = (Math.random() * 20 + 20).toFixed(2) + "s";
    container.appendChild(p);
  }
}

export function setStatus(text, cls = "") {
  const el = $("#statusMessage");
  if (!el) return;
  el.textContent = text;
  el.className = "status-message" + (cls ? " " + cls : "");
}

export function updateAlgorithmInfo() {
  const info = algorithmInfo[state.currentAlgorithm];
  if (!info) return;
  $("#algoTitle").textContent = info.title;
  $("#algoDescription").textContent = info.description;
  $("#timeBest").textContent = info.timeBest;
  $("#timeAvg").textContent = info.timeAvg;
  $("#timeWorst").textContent = info.timeWorst;
  $("#space").textContent = info.space;
  $("#codeSnippet").textContent = info.code;
}

export function resetAll() {
  state.isAnimating = false;
  state.isPaused = false;
  state.animationHandles.forEach((id) => clearTimeout(id));
  state.animationHandles = [];
  const startBtn = $("#startBtn");
  if (startBtn) startBtn.disabled = false;
  const pauseBtn = $("#pauseBtn");
  if (pauseBtn) pauseBtn.textContent = "⏸ Pause";
  renderArray();
  setStatus("Ready to visualize", "");
}

export function finishAnimation() {
  state.isAnimating = false;
  const startBtn = $("#startBtn");
  if (startBtn) startBtn.disabled = false;
  setStatus("Sorting complete!", "success");
}
