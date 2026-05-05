import { state } from '../state.js';
import { drawArray, updateStepInfo } from '../visualizer.js';

export const bubbleSortInfo = {
    title: 'Bubble Sort',
    description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    code: `function bubbleSort(arr) {\n  let n = arr.length;\n  for(let i = 0; i < n - 1; i++) {\n    for(let j = 0; j < n - i - 1; j++) {\n      if(arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}`
};

export function startBubbleSort() {
    state.algoState = {
        arr: state.arrayData.slice(),
        i: 0,
        j: 0,
        n: state.arrayData.length,
        swapped: false,
        steps: 0,
        totalSteps: (state.arrayData.length - 1) * state.arrayData.length / 2
    };
    if (state.timer) clearInterval(state.timer);
    state.timer = setInterval(bubbleSortStep, 900);
}

export function bubbleSortStep() {
    if (!state.algoState) return;
    const s = state.algoState;
    if (s.i >= s.n - 1) {
        if (state.timer) clearInterval(state.timer);
        drawArray(s.arr, [], Array.from({length: s.n}, (_, i) => i));
        updateStepInfo('<span style="color:#25baaa;font-weight:bold">Bubble Sort Complete!</span>');
        return;
    }
    
    if (s.j < s.n - s.i - 1) {
        let swap = false;
        if (s.arr[s.j] > s.arr[s.j + 1]) {
            [s.arr[s.j], s.arr[s.j + 1]] = [s.arr[s.j + 1], s.arr[s.j]];
            s.swapped = true;
            swap = true;
        }
        drawArray(
            s.arr,
            [s.j, s.j + 1],
            swap ? [s.j, s.j + 1] : []
        );
        updateStepInfo(
            swap
                ? `Swapping <b>${s.arr[s.j]}</b> and <b>${s.arr[s.j + 1]}</b> <span style="color:#fe8585">(Step ${s.i + 1}.${s.j + 1})</span>`
                : `Comparing <b>${s.arr[s.j]}</b> and <b>${s.arr[s.j + 1]}</b> <span style="color:#25baaa">(Step ${s.i + 1}.${s.j + 1})</span>`
        );
        s.j++;
    } else {
        if (!s.swapped) {
            if (state.timer) clearInterval(state.timer);
            drawArray(s.arr, [], Array.from({length: s.n}, (_, i) => i));
            updateStepInfo('<span style="color:#25baaa;font-weight:bold">Bubble Sort Complete!</span>');
            return;
        }
        s.j = 0;
        s.i++;
        s.swapped = false;
    }
}
