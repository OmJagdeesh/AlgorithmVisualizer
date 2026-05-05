import { state } from './state.js';

export const vizCanvas = document.getElementById('viz-canvas');
export const stepInfo = document.getElementById('step-info');

export function updateStepInfo(msg) {
    if (stepInfo) stepInfo.innerHTML = msg || '';
}

export function drawArray(arr, highlightIndices = [], swapIndices = []) {
    if (!vizCanvas) return;
    vizCanvas.innerHTML = '';
    
    if (!arr || arr.length === 0) {
        vizCanvas.textContent = 'Enter input to visualize here';
        vizCanvas.style.color = '#558';
        vizCanvas.style.fontSize = '1.2rem';
        vizCanvas.style.textAlign = 'center';
        vizCanvas.style.paddingTop = '140px';
        return;
    }
    
    vizCanvas.style.color = 'inherit';
    vizCanvas.style.fontSize = '';
    vizCanvas.style.textAlign = '';
    vizCanvas.style.paddingTop = '';
    vizCanvas.style.display = 'flex';
    vizCanvas.style.alignItems = 'end';
    vizCanvas.style.justifyContent = 'center';

    const maxVal = Math.max(...arr, 1);

    arr.forEach((val, idx) => {
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';

        const label = document.createElement('span');
        label.className = 'array-label';
        label.textContent = val;
        if (swapIndices && swapIndices.includes(idx)) {
            label.classList.add('label-swap');
        } else if (highlightIndices && highlightIndices.includes(idx)) {
            label.classList.add('label-highlight');
        }

        const bar = document.createElement('div');
        bar.className = 'bar';
        const heightPercent = (val / maxVal) * 95;
        bar.style.height = heightPercent + '%';

        if (swapIndices && swapIndices.includes(idx)) {
            bar.classList.add('bar-swap');
        } else if (highlightIndices && highlightIndices.includes(idx)) {
            bar.classList.add('bar-highlight');
        }

        barContainer.appendChild(label);
        barContainer.appendChild(bar);
        vizCanvas.appendChild(barContainer);
    });
}

export function resetVisualization() {
    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }
    state.algoState = null;
    drawArray(state.arrayData || []);
    updateStepInfo('');
}
