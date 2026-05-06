import { state } from './state.js';

export function sleep(ms) {
  return new Promise((resolve) => {
    const id = setTimeout(() => {
      resolve();
    }, ms);
    state.animationHandles.push(id);
  });
}

export async function waitWhilePaused() {
  while (state.isPaused) {
    await sleep(100);
    if (!state.isAnimating) return;
  }
}
