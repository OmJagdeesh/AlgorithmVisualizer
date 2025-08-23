// main.js

const topics = document.querySelectorAll('.dropdown ul li, #topics > li');
const vizCanvas = document.getElementById('viz-canvas');
const algoTitle = document.getElementById('algo-title');
const algoDesc = document.getElementById('algo-desc');
const algoCode = document.getElementById('algo-code');
const userInput = document.getElementById('user-input');
const startBtn = document.querySelector('#control-panel [title="Start"]');
const pauseBtn = document.querySelector('#control-panel [title="Pause"]');
const stepBtn = document.querySelector('#control-panel [title="Step"]');
const resetBtn = document.querySelector('#control-panel [title="Reset"]');
const stepInfo = document.getElementById('step-info');

// State variables
let currentAlgorithm = null;
let arrayData = [];
let bubbleSortState = null;
let timer = null;

// ====== Event Listeners =======
topics.forEach(item => {
    item.addEventListener('click', () => {
        topics.forEach(t => t.classList.remove('selected'));
        item.classList.add('selected');
        currentAlgorithm = item.textContent.trim();
        displayAlgorithmInfo(currentAlgorithm);
        resetVisualization();
    });
});

userInput.addEventListener('change', () => {
    const inputStr = userInput.value.trim();
    if (!inputStr) return;
    arrayData = inputStr.split(',').map(n => parseInt(n, 10)).filter(n => !isNaN(n));
    resetVisualization();
});

startBtn.addEventListener('click', () => {
    if (!currentAlgorithm || arrayData.length === 0) {
        alert('Select an algorithm and enter valid input.');
        return;
    }
    if (currentAlgorithm.toLowerCase() === 'bubble sort') {
        startBubbleSort();
    } else {
        alert('Animation not implemented for this algorithm yet.');
    }
});

pauseBtn.addEventListener('click', () => {
    if (timer) clearInterval(timer);
});

stepBtn.addEventListener('click', () => {
    if (!bubbleSortState) startBubbleSort();
    else bubbleSortStep();
});

resetBtn.addEventListener('click', resetVisualization);

// ====== Display algorithm info ======
function displayAlgorithmInfo(algo) {
    switch(algo.toLowerCase()) {
        case 'bubble sort':
            algoTitle.textContent = 'Bubble Sort';
            algoDesc.textContent = 'Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.';
            algoCode.textContent =
                `function bubbleSort(arr) {\n` +
                `  let n = arr.length;\n` +
                `  for(let i = 0; i < n - 1; i++) {\n` +
                `    for(let j = 0; j < n - i - 1; j++) {\n` +
                `      if(arr[j] > arr[j + 1]) {\n` +
                `        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n` +
                `      }\n` +
                `    }\n` +
                `  }\n` +
                `  return arr;\n` +
                `}`;
            break;
        default:
            algoTitle.textContent = algo;
            algoDesc.textContent = 'Description not available yet.';
            algoCode.textContent = '// Code not available.';
    }
}

function updateStepInfo(msg) {
    if (stepInfo) stepInfo.innerHTML = msg || '';
}

// ====== Visualization Functions ======
function resetVisualization() {
    if (timer) clearInterval(timer);
    bubbleSortState = null;
    drawArray(arrayData || []);
    updateStepInfo('');
}

function drawArray(arr, highlightIndices = [], swapIndices = []) {
    vizCanvas.innerHTML = '';
    if (arr.length === 0) {
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
        // Container
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';

        // Value label
        const label = document.createElement('span');
        label.className = 'array-label';
        label.textContent = val;
        if (swapIndices && swapIndices.includes(idx)) {
            label.classList.add('label-swap');
        } else if (highlightIndices && highlightIndices.includes(idx)) {
            label.classList.add('label-highlight');
        }

        // Vertical bar
        const bar = document.createElement('div');
        bar.className = 'bar';
        const heightPercent = (val / maxVal) * 95; // 95% of container height
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

// ====== Bubble Sort Animation Logic ======
function startBubbleSort() {
    bubbleSortState = {
        arr: arrayData.slice(),
        i: 0,
        j: 0,
        n: arrayData.length,
        swapped: false,
        steps: 0,
        totalSteps: (arrayData.length - 1) * arrayData.length / 2
    };
    if (timer) clearInterval(timer);
    timer = setInterval(bubbleSortStep, 900);
}

function bubbleSortStep() {
    if (!bubbleSortState) return;
    const s = bubbleSortState;
    if (s.i >= s.n - 1) {
        clearInterval(timer);
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
            clearInterval(timer);
            drawArray(s.arr, [], Array.from({length: s.n}, (_, i) => i));
            updateStepInfo('<span style="color:#25baaa;font-weight:bold">Bubble Sort Complete!</span>');
            return;
        }
        s.j = 0;
        s.i++;
        s.swapped = false;
    }
}
