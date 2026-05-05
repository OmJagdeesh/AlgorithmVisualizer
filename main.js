import { state } from './js/state.js';
import { resetVisualization } from './js/visualizer.js';
import { algorithms } from './js/algorithms/index.js';

const topics = document.querySelectorAll('.dropdown ul li, #topics > li');
const algoTitle = document.getElementById('algo-title');
const algoDesc = document.getElementById('algo-desc');
const algoCode = document.getElementById('algo-code');
const userInput = document.getElementById('user-input');

const startBtn = document.querySelector('#control-panel [title="Start"]');
const pauseBtn = document.querySelector('#control-panel [title="Pause"]');
const stepBtn = document.querySelector('#control-panel [title="Step"]');
const resetBtn = document.querySelector('#control-panel [title="Reset"]');

// ====== Event Listeners =======
topics.forEach(item => {
    item.addEventListener('click', () => {
        topics.forEach(t => t.classList.remove('selected'));
        item.classList.add('selected');
        state.currentAlgorithm = item.textContent.trim().toLowerCase();
        displayAlgorithmInfo(state.currentAlgorithm);
        resetVisualization();
    });
});

userInput.addEventListener('change', () => {
    const inputStr = userInput.value.trim();
    if (!inputStr) return;
    state.arrayData = inputStr.split(',').map(n => parseInt(n, 10)).filter(n => !isNaN(n));
    resetVisualization();
});

startBtn.addEventListener('click', () => {
    if (!state.currentAlgorithm || state.arrayData.length === 0) {
        alert('Select an algorithm and enter valid input.');
        return;
    }
    
    const algo = algorithms[state.currentAlgorithm];
    if (algo && algo.start) {
        algo.start();
    } else {
        alert('Animation not implemented for this algorithm yet.');
    }
});

pauseBtn.addEventListener('click', () => {
    if (state.timer) clearInterval(state.timer);
});

stepBtn.addEventListener('click', () => {
    const algo = algorithms[state.currentAlgorithm];
    if (!algo) return;
    
    if (!state.algoState) {
        if (algo.start) {
            algo.start();
            if (state.timer) {
                clearInterval(state.timer);
            }
            if (algo.step) algo.step();
        }
    } else {
        if (algo.step) algo.step();
    }
});

resetBtn.addEventListener('click', resetVisualization);

// ====== Display algorithm info ======
function displayAlgorithmInfo(algoName) {
    const algo = algorithms[algoName];
    if (algo && algo.info) {
        algoTitle.textContent = algo.info.title;
        algoDesc.textContent = algo.info.description;
        algoCode.textContent = algo.info.code;
    } else {
        // Fallback for algorithms not yet implemented
        const capitalized = algoName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        algoTitle.textContent = capitalized;
        algoDesc.textContent = 'Description not available yet.';
        algoCode.textContent = '// Code not available.';
    }
}
