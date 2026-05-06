import { state } from '../state.js';
import { $ } from '../dom.js';
import { setStatus, resetAll } from '../ui.js';
import { renderArray } from '../visualizer.js';
import { waitWhilePaused, sleep } from '../utils.js';

export async function searchAnim() {
  let target = prompt("Enter a number to search:");
  if (target === null) {
    resetAll();
    return;
  }
  target = parseInt(target);
  if (isNaN(target)) {
    alert("Please enter a valid number");
    resetAll();
    return;
  }

  if (state.currentAlgorithm === "binary") {
    state.array.sort((a, b) => a - b);
    renderArray();
    await sleep(600);
    await binarySearchAnim(target);
  } else {
    await linearSearchAnim(target);
  }
}

export async function linearSearchAnim(target) {
  for (let i = 0; i < state.array.length; i++) {
    if (!state.isAnimating) return;
    await waitWhilePaused();

    renderArray([i], [], []);
    await sleep(Math.max(80, state.animationSpeed));

    if (state.array[i] === target) {
      renderArray([], [i], []);
      setStatus(`Found ${target} at index ${i}`, "success");
      state.isAnimating = false;
      const startBtn = $("#startBtn");
      if (startBtn) startBtn.disabled = false;
      return;
    }
  }
  setStatus(`${target} not found`, "");
  state.isAnimating = false;
  const startBtn = $("#startBtn");
  if (startBtn) startBtn.disabled = false;
}

export async function binarySearchAnim(target) {
  let left = 0, right = state.array.length - 1;

  while (left <= right) {
    if (!state.isAnimating) return;
    await waitWhilePaused();

    const mid = Math.floor((left + right) / 2);
    const range = [];
    for (let i = left; i <= right; i++) range.push(i);
    renderArray(range, [mid], []);
    await sleep(Math.max(80, state.animationSpeed));

    if (state.array[mid] === target) {
      renderArray([], [mid], []);
      setStatus(`Found ${target} at index ${mid}`, "success");
      state.isAnimating = false;
      const startBtn = $("#startBtn");
      if (startBtn) startBtn.disabled = false;
      return;
    } else if (state.array[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  setStatus(`${target} not found`, "");
  state.isAnimating = false;
  const startBtn = $("#startBtn");
  if (startBtn) startBtn.disabled = false;
}
