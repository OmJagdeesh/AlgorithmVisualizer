/* ========= AlgoViz Pro - script.js =========
   Full: particles, rendering, algorithms,
   GSAP-powered animations (if available), controls,
   info panel updates, and voice commands (en-IN).
   Voice commands act silently (no speech synthesis).
   ============================================ */

/* ---------------- Global state ---------------- */
let array = [64, 34, 25, 12, 22, 11, 90];
let currentAlgorithm = "bubble";
let animationSpeed = 1000; // milliseconds base (will be updated by slider)
let isAnimating = false;
let isPaused = false;
let animationHandles = []; // holds setTimeout ids to clear when resetting
const useGSAP = typeof window.gsap !== "undefined";

/* ---------------- Algorithm info ---------------- */
const algorithmInfo = {
  bubble: {
    title: "Bubble Sort",
    description:
      "Bubble Sort repeatedly goes through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
    timeBest: "O(n)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    space: "O(1)",
    code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j+1]) [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
    }
  }
  return arr;
}`
  },
  selection: {
    title: "Selection Sort",
    description:
      "Selection Sort divides the input list into a sorted and an unsorted region, and repeatedly selects the smallest element from the unsorted region to add to the sorted region.",
    timeBest: "O(n²)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    space: "O(1)",
    code: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`
  },
  insertion: {
    title: "Insertion Sort",
    description:
      "Insertion Sort builds the final sorted array one item at a time. It is efficient for small lists and mostly-sorted lists.",
    timeBest: "O(n)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    space: "O(1)",
    code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j+1] = arr[j];
      j--;
    }
    arr[j+1] = key;
  }
  return arr;
}`
  },
  merge: {
    title: "Merge Sort",
    description:
      "Merge Sort is a divide-and-conquer algorithm that divides the list into smaller sublists, sorts them, and then merges them back together.",
    timeBest: "O(n log n)",
    timeAvg: "O(n log n)",
    timeWorst: "O(n log n)",
    space: "O(n)",
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length/2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`
  },
  quick: {
    title: "Quick Sort",
    description:
      "Quick Sort picks a pivot element and partitions the array around it, then recursively sorts the partitions.",
    timeBest: "O(n log n)",
    timeAvg: "O(n log n)",
    timeWorst: "O(n²)",
    space: "O(log n)",
    code: `function quickSort(arr, low=0, high=arr.length-1) {
  if (low < high) {
    const p = partition(arr, low, high);
    quickSort(arr, low, p-1);
    quickSort(arr, p+1, high);
  }
  return arr;
}`
  },
  linear: {
    title: "Linear Search",
    description:
      "Linear Search sequentially checks each element of the list until a match is found or the whole list has been searched.",
    timeBest: "O(1)",
    timeAvg: "O(n)",
    timeWorst: "O(n)",
    space: "O(1)",
    code: `function linearSearch(arr, target) {
  for (let i=0;i<arr.length;i++) if (arr[i]===target) return i;
  return -1;
}`
  },
  binary: {
    title: "Binary Search",
    description:
      "Binary Search finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.",
    timeBest: "O(1)",
    timeAvg: "O(log n)",
    timeWorst: "O(log n)",
    space: "O(1)",
    code: `function binarySearch(arr, target) {
  let l=0, r=arr.length-1;
  while (l<=r) {
    const m = Math.floor((l+r)/2);
    if (arr[m]===target) return m;
    if (arr[m] < target) l = m+1; else r = m-1;
  }
  return -1;
}`
  }
};

/* ---------------- DOM helpers ---------------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ---------------- Particles ---------------- */
function createParticles(count = 20) {
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

/* ---------------- Render / update visuals ---------------- */
function renderArray(comparing = [], swapping = [], sorted = []) {
  const canvas = $("#vizCanvas");
  if (!canvas) return;
  canvas.innerHTML = "";

  const maxValue = Math.max(...array, 1);
  array.forEach((val, index) => {
    const barContainer = document.createElement("div");
    barContainer.className = "array-bar";

    const bar = document.createElement("div");
    bar.className = "bar";
    const height = (val / maxValue) * 300;
    bar.style.height = height + "px";
    bar.dataset.index = index;
    bar.dataset.value = val;

    if (sorted.includes(index)) bar.classList.add("sorted");
    else if (swapping.includes(index)) bar.classList.add("swapping");
    else if (comparing.includes(index)) bar.classList.add("comparing");

    const valueLabel = document.createElement("div");
    valueLabel.className = "bar-value";
    valueLabel.textContent = val;
    if (comparing.includes(index) || swapping.includes(index)) {
      valueLabel.classList.add("highlight");
    }

    barContainer.appendChild(bar);
    barContainer.appendChild(valueLabel);
    canvas.appendChild(barContainer);
  });

  // Entrance flourish with GSAP (if available)
  if (useGSAP) {
    gsap.fromTo(
      "#vizCanvas .array-bar .bar",
      { y: 30, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power2.out", stagger: 0.02 }
    );
  }
}

/* helper: swap animation (heights + labels) */
async function animateSwap(idxA, idxB) {
  const canvas = $("#vizCanvas");
  if (!canvas) return;
  const bars = canvas.querySelectorAll(".array-bar");
  const wrapA = bars[idxA];
  const wrapB = bars[idxB];
  if (!wrapA || !wrapB) return;

  const barA = wrapA.querySelector(".bar");
  const barB = wrapB.querySelector(".bar");
  const labelA = wrapA.querySelector(".bar-value");
  const labelB = wrapB.querySelector(".bar-value");

  if (useGSAP && barA && barB) {
    // rise, twist, swap heights, then drop
    await Promise.all([
      gsap.to(barA, { y: -28, rotate: 6, duration: Math.max(0.08, animationSpeed / 1500), ease: "power1.out" }),
      gsap.to(barB, { y: -28, rotate: -6, duration: Math.max(0.08, animationSpeed / 1500), ease: "power1.out" })
    ]);

    const hA = barA.style.height;
    const hB = barB.style.height;

    await Promise.all([
      gsap.to(barA, { height: hB, duration: Math.max(0.15, animationSpeed / 1000), ease: "elastic.out(1,0.6)" }),
      gsap.to(barB, { height: hA, duration: Math.max(0.15, animationSpeed / 1000), ease: "elastic.out(1,0.6)" })
    ]);

    // swap labels text
    if (labelA && labelB) {
      const tA = labelA.textContent;
      labelA.textContent = labelB.textContent;
      labelB.textContent = tA;
    }

    await Promise.all([
      gsap.to(barA, { y: 0, rotate: 0, duration: Math.max(0.08, animationSpeed / 2000), ease: "power2.in" }),
      gsap.to(barB, { y: 0, rotate: 0, duration: Math.max(0.08, animationSpeed / 2000), ease: "power2.in" })
    ]);
  } else {
    // fallback: swap heights/text instantly and wait
    if (barA && barB && labelA && labelB) {
      const tmpH = barA.style.height;
      const tmpT = labelA.textContent;
      barA.style.height = barB.style.height;
      labelA.textContent = labelB.textContent;
      barB.style.height = tmpH;
      labelB.textContent = tmpT;
    }
    await sleep(Math.max(80, animationSpeed / 3));
  }
}

/* ---------------- UI: algorithm info update ---------------- */
function updateAlgorithmInfo() {
  const info = algorithmInfo[currentAlgorithm];
  if (!info) return;
  $("#algoTitle").textContent = info.title;
  $("#algoDescription").textContent = info.description;
  $("#timeBest").textContent = info.timeBest;
  $("#timeAvg").textContent = info.timeAvg;
  $("#timeWorst").textContent = info.timeWorst;
  $("#space").textContent = info.space;
  $("#codeSnippet").textContent = info.code;
}

/* ---------------- Input and control handlers ---------------- */
function handleArrayInput(e) {
  const input = e.target.value.trim();
  if (!input) return;
  const nums = input
    .split(",")
    .map((n) => parseInt(n.trim()))
    .filter((n) => !isNaN(n));
  if (nums.length > 0) {
    array = nums.slice(0, 15); // cap to 15 for clarity
    resetAll();
  }
}

function generateRandomArray() {
  const size = Math.floor(Math.random() * 8) + 8; // 8-15
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
  $("#arrayInput").value = array.join(", ");
  resetAll();
}

function handleSpeedChange(e) {
  // inverse for intuitive slider: lower slider -> faster
  animationSpeed = 2100 - e.target.value;
  $("#speedValue").textContent = (animationSpeed / 1000).toFixed(1) + "s";
}

/* ---------------- Animation controls ---------------- */
function startAnimation() {
  if (isAnimating) return;
  isAnimating = true;
  isPaused = false;
  $("#startBtn").disabled = true;
  setStatus("Running...", "warning");

  // Kick off appropriate animation
  switch (currentAlgorithm) {
    case "bubble":
      bubbleSortAnim();
      break;
    case "selection":
      selectionSortAnim();
      break;
    case "insertion":
      insertionSortAnim();
      break;
    case "merge":
      mergeSortAnim();
      break;
    case "quick":
      quickSortAnim();
      break;
    case "linear":
    case "binary":
      searchAnim();
      break;
    default:
      setStatus("Unknown algorithm", "");
      isAnimating = false;
      $("#startBtn").disabled = false;
  }
}

function pauseAnimation() {
  isPaused = !isPaused;
  $("#pauseBtn").textContent = isPaused ? "▶ Resume" : "⏸ Pause";
  setStatus(isPaused ? "Paused" : "Running", isPaused ? "warning" : "warning");
}

function resetAll() {
  isAnimating = false;
  isPaused = false;
  animationHandles.forEach((id) => clearTimeout(id));
  animationHandles = [];
  $("#startBtn").disabled = false;
  $("#pauseBtn").textContent = "⏸ Pause";
  renderArray();
  setStatus("Ready to visualize", "");
}

/* small helper */
function setStatus(text, cls = "") {
  const el = $("#statusMessage");
  el.textContent = text;
  el.className = "status-message" + (cls ? " " + cls : "");
}

/* Sleep wrapper that records timer id for cancellation */
function sleep(ms) {
  return new Promise((resolve) => {
    const id = setTimeout(() => {
      resolve();
    }, ms);
    animationHandles.push(id);
  });
}

/* wait while paused */
async function waitWhilePaused() {
  while (isPaused) {
    // small sleep to avoid tight loop
    await sleep(100);
    if (!isAnimating) return; // bail out if reset occurred
  }
}

/* ---------------- Sorting + Searching Animations ---------------- */

/* Bubble Sort Animation */
async function bubbleSortAnim() {
  const arr = [...array];
  const n = arr.length;
  const sorted = [];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (!isAnimating) return;
      await waitWhilePaused();

      renderArray([j, j + 1], [], sorted);
      await sleep(Math.max(80, animationSpeed));

      if (arr[j] > arr[j + 1]) {
        // swap model
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        array = [...arr];
        // animate visually
        await animateSwap(j, j + 1);
      }
    }
    sorted.push(n - i - 1);
  }
  sorted.push(0);
  array = [...arr];
  renderArray([], [], sorted);
  finishAnimation();
}

/* Selection Sort Animation */
async function selectionSortAnim() {
  const arr = [...array];
  const n = arr.length;
  const sorted = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (!isAnimating) return;
      await waitWhilePaused();

      renderArray([minIdx, j], [], sorted);
      await sleep(Math.max(70, animationSpeed / 1.2));

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        // pulse when new min found
        if (useGSAP) {
          gsap.fromTo(
            `#vizCanvas .array-bar:nth-child(${minIdx + 1}) .bar`,
            { scale: 1.05 },
            { scale: 1, duration: 0.18, yoyo: true, repeat: 1 }
          );
        }
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      array = [...arr];
      await animateSwap(i, minIdx);
    }

    sorted.push(i);
  }
  sorted.push(n - 1);
  renderArray([], [], sorted);
  finishAnimation();
}

/* Insertion Sort Animation */
async function insertionSortAnim() {
  const arr = [...array];
  const n = arr.length;
  let sorted = [0];

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      if (!isAnimating) return;
      await waitWhilePaused();

      renderArray([j, j + 1], [], sorted);
      await sleep(Math.max(70, animationSpeed / 1.5));

      arr[j + 1] = arr[j];
      array = [...arr];

      if (useGSAP) {
        gsap.fromTo(
          `#vizCanvas .array-bar:nth-child(${j + 2}) .bar`,
          { y: -10, scale: 1.02 },
          { y: 0, scale: 1, duration: Math.max(0.12, animationSpeed / 1200), ease: "bounce.out" }
        );
      }

      await sleep(Math.max(60, animationSpeed / 1.8));
      j--;
    }

    arr[j + 1] = key;
    array = [...arr];
    sorted.push(i);
    renderArray([], [], sorted);
    await sleep(Math.max(80, animationSpeed / 1.5));
  }

  renderArray([], [], Array.from({ length: n }, (_, i) => i));
  finishAnimation();
}

/* Merge Sort Animation (iterative bottom-up visualization) */
async function mergeSortAnim() {
  const arr = [...array];
  const n = arr.length;

  for (let width = 1; width < n; width *= 2) {
    for (let left = 0; left < n; left += 2 * width) {
      if (!isAnimating) return;
      await waitWhilePaused();

      const mid = Math.min(left + width - 1, n - 1);
      const right = Math.min(left + 2 * width - 1, n - 1);

      // highlight range
      const range = [];
      for (let k = left; k <= right; k++) range.push(k);
      renderArray(range, [], []);
      await sleep(Math.max(120, animationSpeed / 1.2));

      // merge operation (in data)
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
        array = [...arr];
        // animate small scale effect for each placed element
        if (useGSAP) {
          const elIdx = left + k + 1;
          gsap.fromTo(
            `#vizCanvas .array-bar:nth-child(${elIdx}) .bar`,
            { scaleY: 0.85 },
            { scaleY: 1, duration: Math.max(0.12, animationSpeed / 1400), ease: "elastic.out(1,0.6)" }
          );
        }
        await sleep(Math.max(80, animationSpeed / 1.8));
      }
    }
  }

  renderArray([], [], Array.from({ length: n }, (_, i) => i));
  finishAnimation();
}

/* Quick Sort Animation (recursive with animated partition) */
async function quickSortAnim() {
  const arr = [...array];

  async function qsort(low, high) {
    if (low >= high || !isAnimating) return;
    await waitWhilePaused();

    const pivot = arr[high];
    let i = low - 1;

    // highlight pivot visually
    renderArray([], [high], []);
    if (useGSAP) {
      gsap.to(`#vizCanvas .array-bar:nth-child(${high + 1}) .bar`, { scale: 1.06, duration: 0.22, yoyo: true, repeat: 1 });
    }
    await sleep(Math.max(120, animationSpeed / 1.6));

    for (let j = low; j < high; j++) {
      if (!isAnimating) return;
      await waitWhilePaused();

      renderArray([j, high], [], []);
      await sleep(Math.max(80, animationSpeed / 2));

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        array = [...arr];
        await animateSwap(i, j);
      }
    }

    // place pivot
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    array = [...arr];
    await animateSwap(i + 1, high);

    await qsort(low, i);
    await qsort(i + 2, high);
  }

  await qsort(0, arr.length - 1);

  renderArray([], [], Array.from({ length: arr.length }, (_, i) => i));
  finishAnimation();
}

/* ---------------- Searching Animations ---------------- */
async function searchAnim() {
  // ask for target via prompt
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

  if (currentAlgorithm === "binary") {
    // sort first visually
    array.sort((a, b) => a - b);
    renderArray();
    await sleep(600);
    await binarySearchAnim(target);
  } else {
    await linearSearchAnim(target);
  }
}

async function linearSearchAnim(target) {
  for (let i = 0; i < array.length; i++) {
    if (!isAnimating) return;
    await waitWhilePaused();

    renderArray([i], [], []);
    await sleep(Math.max(80, animationSpeed));

    if (array[i] === target) {
      renderArray([], [i], []);
      setStatus(`Found ${target} at index ${i}`, "success");
      isAnimating = false;
      $("#startBtn").disabled = false;
      return;
    }
  }
  setStatus(`${target} not found`, "");
  isAnimating = false;
  $("#startBtn").disabled = false;
}

async function binarySearchAnim(target) {
  let left = 0, right = array.length - 1;

  while (left <= right) {
    if (!isAnimating) return;
    await waitWhilePaused();

    const mid = Math.floor((left + right) / 2);
    const range = [];
    for (let i = left; i <= right; i++) range.push(i);
    renderArray(range, [mid], []);
    await sleep(Math.max(80, animationSpeed));

    if (array[mid] === target) {
      renderArray([], [mid], []);
      setStatus(`Found ${target} at index ${mid}`, "success");
      isAnimating = false;
      $("#startBtn").disabled = false;
      return;
    } else if (array[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  setStatus(`${target} not found`, "");
  isAnimating = false;
  $("#startBtn").disabled = false;
}

/* ---------------- Finish ---------------- */
function finishAnimation() {
  isAnimating = false;
  $("#startBtn").disabled = false;
  setStatus("Sorting complete!", "success");
}

/* ---------------- Voice Commands (en-IN) ---------------- */
/* Toggle button: #voiceBtn (provided in your HTML). Commands act silently. */
let recognition = null;
let voiceActive = false;

function setupVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    // not supported — no voice available
    console.warn("SpeechRecognition not supported in this browser.");
    return;
  }
  recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const res = event.results[event.results.length - 1];
    const transcript = res[0].transcript.trim().toLowerCase();
    console.log("Voice command:", transcript);
    handleVoiceTranscript(transcript);
  };

  recognition.onerror = (err) => {
    console.error("Voice recognition error:", err);
  };

  recognition.onend = () => {
    // if voice toggle still active, restart listening
    if (voiceActive) {
      try {
        recognition.start();
      } catch (e) {
        // ignore start double-call errors
      }
    }
  };
}

function handleVoiceTranscript(text) {
  // common commands:
  // start <algorithm>
  // pause / resume
  // reset
  // generate / random
  // set speed to <number> (interpreted as seconds)
  if (text.includes("start")) {
    if (text.includes("bubble")) selectAndStart("bubble");
    else if (text.includes("selection")) selectAndStart("selection");
    else if (text.includes("insertion")) selectAndStart("insertion");
    else if (text.includes("merge")) selectAndStart("merge");
    else if (text.includes("quick")) selectAndStart("quick");
    else if (text.includes("linear")) selectAndStart("linear");
    else if (text.includes("binary")) selectAndStart("binary");
    else {
      // if only 'start' then start current
      startAnimation();
    }
  } else if (text.includes("pause")) {
    pauseAnimation();
  } else if (text.includes("resume")) {
    if (isPaused) pauseAnimation(); // toggles
  } else if (text.includes("reset")) {
    resetAll();
  } else if (text.includes("generate") || text.includes("random") || text.includes("new array")) {
    generateRandomArray();
  } else if (text.includes("set speed")) {
    // try to find number (seconds) in the transcript
    const numMatch = text.match(/(\d+(\.\d+)?)/);
    if (numMatch) {
      const seconds = parseFloat(numMatch[0]);
      if (!isNaN(seconds)) {
        // map seconds to slider mapping (slider value -> animationSpeed = 2100 - slider)
        // reverse mapping: animationSpeed = seconds * 1000
        animationSpeed = Math.max(80, Math.min(2000, seconds * 1000));
        // update UI speedValue
        const val = 2100 - animationSpeed;
        const slider = $("#speedSlider");
        if (slider) slider.value = val;
        $("#speedValue").textContent = (animationSpeed / 1000).toFixed(1) + "s";
      }
    }
  } else {
    console.log("Unrecognized voice command:", text);
  }
}

function selectAndStart(algo) {
  // set button active
  $$(".algo-btn").forEach((b) => b.classList.remove("active"));
  const btn = $(`.algo-btn[data-algo="${algo}"]`);
  if (btn) btn.classList.add("active");
  currentAlgorithm = algo;
  resetAll();
  updateAlgorithmInfo();
  startAnimation();
}

/* voice toggle wiring */
function toggleVoice() {
  const btn = $("#voiceBtn");
  if (!btn) return;
  voiceActive = !voiceActive;
  if (voiceActive) {
    btn.classList.add("active");
    btn.textContent = "🎙 Listening...";
    if (!recognition) setupVoiceRecognition();
    try {
      recognition.start();
    } catch (e) {
      // ignore double-start error
    }
    setStatus("Voice: Listening...", "warning");
  } else {
    btn.classList.remove("active");
    btn.textContent = "🎤 Voice";
    if (recognition) recognition.stop();
    setStatus("Voice: Off", "");
  }
}

/* ---------------- Wiring DOM events on load ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  // initial UI
  createParticles();
  renderArray();
  updateAlgorithmInfo();

  // buttons
  $("#startBtn")?.addEventListener("click", () => {
    // disable if already animating
    if (!isAnimating) startAnimation();
  });
  $("#pauseBtn")?.addEventListener("click", pauseAnimation);
  $("#resetBtn")?.addEventListener("click", resetAll);
  $("#generateBtn")?.addEventListener("click", generateRandomArray);
  $("#arrayInput")?.addEventListener("change", handleArrayInput);
  $("#speedSlider")?.addEventListener("input", handleSpeedChange);

  // algorithm buttons wiring (keeps UI consistent)
  $$(".algo-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      $$(".algo-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentAlgorithm = btn.dataset.algo;
      updateAlgorithmInfo();
      resetAll();
    });
  });

  // voice toggle button
  $("#voiceBtn")?.addEventListener("click", toggleVoice);

  // Setup recognition object ready (but do not auto-start)
  if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    setupVoiceRecognition();
  } else {
    // Not supported: optional UI change can be done here (not required)
    console.info("SpeechRecognition API unavailable.");
  }
});

/* ---------------- End of script.js ---------------- */
