import { state } from '../state.js';
import { renderTree } from '../visualizer.js';
import { waitWhilePaused, sleep } from '../utils.js';
import { finishAnimation } from '../ui.js';

export async function preorderAnim() {
  const n = state.array.length;
  const visited = [];
  const result = [];

  async function traverse(idx) {
    if (idx >= n || !state.isAnimating) return;
    
    // Visit Node
    await waitWhilePaused();
    renderTree(idx, visited);
    await sleep(Math.max(200, state.animationSpeed));
    visited.push(idx);
    result.push(state.array[idx]);

    // Left child
    await traverse(2 * idx + 1);
    
    // Right child
    await traverse(2 * idx + 2);
  }

  await traverse(0);
  
  if (state.isAnimating) {
    renderTree(-1, visited);
    finishAnimation(`Traversal: ${result.join(" → ")}`);
  }
}

export async function inorderAnim() {
  const n = state.array.length;
  const visited = [];
  const result = [];

  async function traverse(idx) {
    if (idx >= n || !state.isAnimating) return;
    
    // Left child
    await traverse(2 * idx + 1);

    // Visit Node
    await waitWhilePaused();
    renderTree(idx, visited);
    await sleep(Math.max(200, state.animationSpeed));
    visited.push(idx);
    result.push(state.array[idx]);
    
    // Right child
    await traverse(2 * idx + 2);
  }

  await traverse(0);
  
  if (state.isAnimating) {
    renderTree(-1, visited);
    finishAnimation(`Traversal: ${result.join(" → ")}`);
  }
}

export async function postorderAnim() {
  const n = state.array.length;
  const visited = [];
  const result = [];

  async function traverse(idx) {
    if (idx >= n || !state.isAnimating) return;
    
    // Left child
    await traverse(2 * idx + 1);
    
    // Right child
    await traverse(2 * idx + 2);

    // Visit Node
    await waitWhilePaused();
    renderTree(idx, visited);
    await sleep(Math.max(200, state.animationSpeed));
    visited.push(idx);
    result.push(state.array[idx]);
  }

  await traverse(0);
  
  if (state.isAnimating) {
    renderTree(-1, visited);
    finishAnimation(`Traversal: ${result.join(" → ")}`);
  }
}
