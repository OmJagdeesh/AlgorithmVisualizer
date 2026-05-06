import { state } from '../state.js';
import { renderArray, animateSwap } from '../visualizer.js';
import { waitWhilePaused, sleep } from '../utils.js';
import { finishAnimation } from '../ui.js';

export async function bubbleSortAnim() {
  const arr = [...state.array];
  const n = arr.length;
  const sorted = [];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (!state.isAnimating) return;
      await waitWhilePaused();

      renderArray([j, j + 1], [], sorted);
      await sleep(Math.max(80, state.animationSpeed));

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        state.array = [...arr];
        await animateSwap(j, j + 1);
      }
    }
    sorted.push(n - i - 1);
  }
  sorted.push(0);
  state.array = [...arr];
  renderArray([], [], sorted);
  finishAnimation();
}

export async function selectionSortAnim() {
  const arr = [...state.array];
  const n = arr.length;
  const sorted = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (!state.isAnimating) return;
      await waitWhilePaused();

      renderArray([minIdx, j], [], sorted);
      await sleep(Math.max(70, state.animationSpeed / 1.2));

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        if (state.useGSAP && window.gsap) {
          window.gsap.fromTo(
            `#vizCanvas .array-bar:nth-child(${minIdx + 1}) .bar`,
            { scale: 1.05 },
            { scale: 1, duration: 0.18, yoyo: true, repeat: 1 }
          );
        }
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      state.array = [...arr];
      await animateSwap(i, minIdx);
    }

    sorted.push(i);
  }
  sorted.push(n - 1);
  renderArray([], [], sorted);
  finishAnimation();
}

export async function insertionSortAnim() {
  const arr = [...state.array];
  const n = arr.length;
  let sorted = [0];

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      if (!state.isAnimating) return;
      await waitWhilePaused();

      renderArray([j, j + 1], [], sorted);
      await sleep(Math.max(70, state.animationSpeed / 1.5));

      arr[j + 1] = arr[j];
      state.array = [...arr];

      if (state.useGSAP && window.gsap) {
        window.gsap.fromTo(
          `#vizCanvas .array-bar:nth-child(${j + 2}) .bar`,
          { y: -10, scale: 1.02 },
          { y: 0, scale: 1, duration: Math.max(0.12, state.animationSpeed / 1200), ease: "bounce.out" }
        );
      }

      await sleep(Math.max(60, state.animationSpeed / 1.8));
      j--;
    }

    arr[j + 1] = key;
    state.array = [...arr];
    sorted.push(i);
    renderArray([], [], sorted);
    await sleep(Math.max(80, state.animationSpeed / 1.5));
  }

  renderArray([], [], Array.from({ length: n }, (_, i) => i));
  finishAnimation();
}

export async function mergeSortAnim() {
  const arr = [...state.array];
  const n = arr.length;

  for (let width = 1; width < n; width *= 2) {
    for (let left = 0; left < n; left += 2 * width) {
      if (!state.isAnimating) return;
      await waitWhilePaused();

      const mid = Math.min(left + width - 1, n - 1);
      const right = Math.min(left + 2 * width - 1, n - 1);

      const range = [];
      for (let k = left; k <= right; k++) range.push(k);
      renderArray(range, [], []);
      await sleep(Math.max(120, state.animationSpeed / 1.2));

      const merged = [];
      let L = left, R = mid + 1;
      while (L <= mid && R <= right) {
        if (arr[L] <= arr[R]) merged.push(arr[L++]);
        else merged.push(arr[R++]);
      }
      while (L <= mid) merged.push(arr[L++]);
      while (R <= right) merged.push(arr[R++]);

      for (let k = 0; k < merged.length; k++) {
        arr[left + k] = merged[k];
        state.array = [...arr];
        if (state.useGSAP && window.gsap) {
          const elIdx = left + k + 1;
          window.gsap.fromTo(
            `#vizCanvas .array-bar:nth-child(${elIdx}) .bar`,
            { scaleY: 0.85 },
            { scaleY: 1, duration: Math.max(0.12, state.animationSpeed / 1400), ease: "elastic.out(1,0.6)" }
          );
        }
        await sleep(Math.max(80, state.animationSpeed / 1.8));
      }
    }
  }

  renderArray([], [], Array.from({ length: n }, (_, i) => i));
  finishAnimation();
}

export async function quickSortAnim() {
  const arr = [...state.array];

  async function qsort(low, high) {
    if (low >= high || !state.isAnimating) return;
    await waitWhilePaused();

    const pivot = arr[high];
    let i = low - 1;

    renderArray([], [high], []);
    if (state.useGSAP && window.gsap) {
      window.gsap.to(`#vizCanvas .array-bar:nth-child(${high + 1}) .bar`, { scale: 1.06, duration: 0.22, yoyo: true, repeat: 1 });
    }
    await sleep(Math.max(120, state.animationSpeed / 1.6));

    for (let j = low; j < high; j++) {
      if (!state.isAnimating) return;
      await waitWhilePaused();

      renderArray([j, high], [], []);
      await sleep(Math.max(80, state.animationSpeed / 2));

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        state.array = [...arr];
        await animateSwap(i, j);
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    state.array = [...arr];
    await animateSwap(i + 1, high);

    await qsort(low, i);
    await qsort(i + 2, high);
  }

  await qsort(0, arr.length - 1);

  renderArray([], [], Array.from({ length: arr.length }, (_, i) => i));
  finishAnimation();
}
