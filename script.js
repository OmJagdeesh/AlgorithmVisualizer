
      // DOM elements
      const viz = document.getElementById("viz");
      const stepInfo = document.getElementById("step-info");
      const userInput = document.getElementById("user-input");
      const controls = document.querySelectorAll("#controls button");
      const startBtn = controls[0];
      const pauseBtn = controls[1];
      const stepBtn = controls[2];
      const resetBtn = controls[3];
      const viewAlgoBtn = document.getElementById("viewAlgoBtn");
      const modal = document.getElementById("algoModal");
      const modalClose = modal.querySelector(".modal-close");
      const algoModalTitle = document.getElementById("algoModalTitle");
      const algoModalDesc = document.getElementById("algoModalDesc");
      const algoTitle = document.getElementById("algo-title");
      const algoCode = document.getElementById("algo-code");
      const algoDesc = document.getElementById("algo-desc");

      // State variables
      let currentAlgorithm = null;
      let arrayData = [];
      let bubbleState = null;
      let mergeState = null;
      let quickState = null;
      let timer = null;

      // Utility functions
      function clearTimer() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      function resetVisualization() {
        clearTimer();
        bubbleState = null;
        mergeState = null;
        quickState = null;
        drawArray(arrayData);
        updateStepInfo("Visualization reset. Ready to start.");
      }

      function drawArray(arr, highlights = [], swaps = [], pivots = []) {
        viz.innerHTML = "";
        if (arr.length === 0) {
          viz.textContent = "Enter an array above.";
          viz.style.color = "#558";
          viz.style.fontSize = "1.2rem";
          viz.style.textAlign = "center";
          viz.style.paddingTop = "150px";
          return;
        }
        const maxVal = Math.max(...arr, 1);
        viz.style.display = "flex";
        viz.style.justifyContent = "center";
        viz.style.alignItems = "flex-end";
        viz.style.color = "";
        viz.style.fontSize = "";
        viz.style.paddingTop = "";
        for (let i = 0; i < arr.length; i++) {
          const container = document.createElement("div");
          container.className = "bar-container";

          const label = document.createElement("span");
          label.className = "array-value";
          label.textContent = arr[i];
          if (swaps.includes(i)) label.classList.add("swap");
          else if (pivots.includes(i)) label.classList.add("pivot");
          else if (highlights.includes(i)) label.classList.add("highlight");

          const bar = document.createElement("div");
          bar.className = "bar";
          bar.style.height = (arr[i] / maxVal) * 90 + "%";
          if (swaps.includes(i)) bar.classList.add("swap");
          else if (pivots.includes(i)) bar.classList.add("pivot");
          else if (highlights.includes(i)) bar.classList.add("highlight");

          container.appendChild(label);
          container.appendChild(bar);
          viz.appendChild(container);
        }
      }

      function updateStepInfo(text) {
        stepInfo.textContent = text;
      }

      // Bubble Sort animation logic (unchanged)
      async function animateSwap(el1, el2) {
        return new Promise((resolve) => {
          const rect1 = el1.getBoundingClientRect();
          const rect2 = el2.getBoundingClientRect();
          const dist = rect2.left - rect1.left;

          el1.style.transition = "transform 0.4s ease";
          el2.style.transition = "transform 0.4s ease";
          el1.style.transform = `translateX(${dist}px)`;
          el2.style.transform = `translateX(${-dist}px)`;

          setTimeout(() => {
            el1.style.transition = "";
            el2.style.transition = "";
            el1.style.transform = "";
            el2.style.transform = "";
            const p = el1.parentNode;
            if (rect1.left < rect2.left) {
              p.insertBefore(el2, el1);
            } else {
              p.insertBefore(el1, el2);
            }
            resolve();
          }, 400);
        });
      }

      function startBubbleSort(stepMode = false) {
        if (arrayData.length < 2) return;
        bubbleState = {
          arr: arrayData.slice(),
          i: 0,
          j: 0,
          n: arrayData.length,
          swapped: false,
          stepMode,
        };
        clearTimer();
        if (stepMode) bubbleSortStep();
        else timer = setInterval(bubbleSortStep, 900);
      }

      async function bubbleSortStep() {
        if (!bubbleState) return;
        let s = bubbleState;
        if (s.i >= s.n - 1) {
          clearTimer();
          drawArray(s.arr, [], [...Array(s.n).keys()]);
          updateStepInfo("Bubble Sort Completed!");
          return;
        }
        if (s.j < s.n - 1 - s.i) {
          const bars = viz.querySelectorAll(".bar-container");
          const el1 = bars[s.j];
          const el2 = bars[s.j + 1];
          let swappedNow = false;
          if (s.arr[s.j] > s.arr[s.j + 1]) {
            swappedNow = true;
            await animateSwap(el1, el2);
            [s.arr[s.j], s.arr[s.j + 1]] = [s.arr[s.j + 1], s.arr[s.j]];
            s.swapped = true;
          }
          drawArray(s.arr, [s.j, s.j + 1], swappedNow ? [s.j, s.j + 1] : []);
          updateStepInfo(
            swappedNow
              ? `Swapping ${s.arr[s.j]} and ${s.arr[s.j + 1]}`
              : `Comparing ${s.arr[s.j]} and ${s.arr[s.j + 1]}`
          );
          s.j++;
          if (s.stepMode) return;
        } else {
          if (!s.swapped) {
            clearTimer();
            drawArray(s.arr, [], [...Array(s.n).keys()]);
            updateStepInfo("Bubble Sort Completed!");
            return;
          }
          s.j = 0;
          s.i++;
          s.swapped = false;
        }
      }

      // --- Merge Sort animation logic (unchanged from previous fix) ---
      function startMergeSort(stepMode = false) {
        if (arrayData.length < 2) return;
        mergeState = {
          arr: arrayData.slice(), // original array reference
          displayArr: arrayData.slice(), // what we render and update step-by-step
          tasks: [], // list of merge tasks (start, mid, end) in postorder
          currentTaskIndex: 0,
          currentMerge: null, // holds in-progress merge state
          stepMode,
        };
        clearTimer();
        // generate merge tasks in post-order (so dependencies resolved)
        mergeState.tasks = [];
        generateMergeTasks(0, mergeState.arr.length - 1, mergeState.tasks);
        drawArray(mergeState.displayArr);
        if (stepMode) mergeSortStep();
        else timer = setInterval(mergeSortStep, 750);
      }

      // generate tasks: each task = {start, mid, end}
      function generateMergeTasks(start, end, tasks) {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        generateMergeTasks(start, mid, tasks);
        generateMergeTasks(mid + 1, end, tasks);
        tasks.push({ start, mid, end });
      }

      function mergeSortStep() {
        if (!mergeState) return;

        // If no current merge in progress, fetch next task
        if (!mergeState.currentMerge) {
          if (mergeState.currentTaskIndex >= mergeState.tasks.length) {
            // done
            clearTimer();
            drawArray(
              mergeState.displayArr,
              [],
              [...Array(mergeState.arr.length).keys()]
            );
            updateStepInfo("Merge Sort Completed!");
            return;
          }

          const task = mergeState.tasks[mergeState.currentTaskIndex];
          const { start, mid, end } = task;
          // capture left and right as they are before this merge begins
          const left = mergeState.displayArr.slice(start, mid + 1);
          const right = mergeState.displayArr.slice(mid + 1, end + 1);

          mergeState.currentMerge = {
            start,
            mid,
            end,
            left,
            right,
            i: 0,
            j: 0,
            k: 0, // number of elements written so far into [start..end]
          };

          updateStepInfo(
            `Starting merge for indices [${start}..${mid}] and [${
              mid + 1
            }..${end}]`
          );
          // highlight the range being merged
          drawArray(
            mergeState.displayArr,
            Array.from({ length: end - start + 1 }, (_, idx) => start + idx)
          );
          if (mergeState.stepMode) return; // on step mode show initial highlight then return
        }

        // progress current merge by one write
        const m = mergeState.currentMerge;
        const writeIndex = m.start + m.k;
        let valueToWrite;
        let infoMsg = "";

        if (m.i < m.left.length && m.j < m.right.length) {
          if (m.left[m.i] <= m.right[m.j]) {
            valueToWrite = m.left[m.i++];
            infoMsg = `Placing ${valueToWrite} from left at index ${writeIndex}`;
          } else {
            valueToWrite = m.right[m.j++];
            infoMsg = `Placing ${valueToWrite} from right at index ${writeIndex}`;
          }
        } else if (m.i < m.left.length) {
          valueToWrite = m.left[m.i++];
          infoMsg = `Draining left: placing ${valueToWrite} at index ${writeIndex}`;
        } else {
          valueToWrite = m.right[m.j++];
          infoMsg = `Draining right: placing ${valueToWrite} at index ${writeIndex}`;
        }

        // write the value into displayArr
        mergeState.displayArr[writeIndex] = valueToWrite;
        m.k++;

        // render and highlight the written index
        drawArray(mergeState.displayArr, [writeIndex], []);
        updateStepInfo(infoMsg);

        // if merge finished, clear currentMerge and advance to next task
        if (m.k >= m.left.length + m.right.length) {
          mergeState.currentMerge = null;
          mergeState.currentTaskIndex++;
          // small pause visualizing the finished merge range
          const finishedStart =
            mergeState.tasks[Math.max(0, mergeState.currentTaskIndex - 1)]
              .start;
          const finishedEnd =
            mergeState.tasks[Math.max(0, mergeState.currentTaskIndex - 1)].end;
          drawArray(
            mergeState.displayArr,
            Array.from(
              { length: finishedEnd - finishedStart + 1 },
              (_, idx) => finishedStart + idx
            )
          );
          updateStepInfo(
            `Completed merge for indices [${finishedStart}..${finishedEnd}]`
          );
        }

        // If in step mode, we should only do one small unit of work per click.
        if (mergeState.stepMode) return;
      }

      // --- Quick Sort animation logic (new) ---
      function startQuickSort(stepMode = false) {
        if (arrayData.length < 2) return;
        quickState = {
          arr: arrayData.slice(), // working array that we mutate in place
          tasks: [], // stack of segments to process {low, high}
          current: null, // current partition in-progress
          stepMode,
        };
        // initial task: whole array
        quickState.tasks.push({ low: 0, high: quickState.arr.length - 1 });
        clearTimer();
        drawArray(quickState.arr);
        if (stepMode) quickSortStep();
        else timer = setInterval(quickSortStep, 650);
      }

      // Each partition task's structure:
      // { low, high, pivot, i, j, phase }
      // phase: 'init' -> set pivot; 'partition' -> scanning j; 'finalize' -> swap pivot; 'done'
      function quickSortStep() {
        if (!quickState) return;

        // If no in-progress partition, pop next task
        if (!quickState.current) {
          if (quickState.tasks.length === 0) {
            // completed
            clearTimer();
            drawArray(quickState.arr, [], [], []);
            updateStepInfo("Quick Sort Completed!");
            return;
          }

          const seg = quickState.tasks.pop(); // LIFO for depth-first quicksort
          const { low, high } = seg;
          if (low >= high) {
            // nothing to sort
            if (quickState.stepMode) return;
            else return; // move to next task automatically
          }

          quickState.current = {
            low,
            high,
            pivot: quickState.arr[high],
            i: low,
            j: low,
            phase: "partition",
            swapsThisStep: [],
          };

          updateStepInfo(
            `Partitioning range [${low}..${high}] with pivot ${quickState.current.pivot}`
          );
          // highlight range and pivot
          drawArray(
            quickState.arr,
            Array.from({ length: high - low + 1 }, (_, idx) => low + idx),
            [],
            [high]
          );
          if (quickState.stepMode) return;
        }

        const c = quickState.current;
        // partition loop: for j in [low..high-1]
        if (c.j <= c.high - 1) {
          const comparingIndex = c.j;
          if (c.arr[c.j] < c.pivot) {
            // swap arr[i] and arr[j]
            [c.arr[c.i], c.arr[c.j]] = [c.arr[c.j], c.arr[c.i]];
            c.swapsThisStep = [c.i, c.j];
            updateStepInfo(
              `Swapping ${c.arr[c.i]} and ${
                c.arr[c.j]
              } (placing smaller than pivot)`
            );
            drawArray(c.arr, [c.i, c.j], c.swapsThisStep, [c.high]);
            c.i++;
            c.j++;
            if (quickState.stepMode) return;
          } else {
            updateStepInfo(
              `Comparing ${c.arr[c.j]} >= pivot ${c.pivot}, move j`
            );
            drawArray(c.arr, [c.j], [], [c.high]);
            c.j++;
            if (quickState.stepMode) return;
          }
        } else if (c.j === c.high) {
          // finished scanning, now swap pivot into position i
          [c.arr[c.i], c.arr[c.high]] = [c.arr[c.high], c.arr[c.i]];
          const pivotIndex = c.i;
          updateStepInfo(`Placing pivot ${c.pivot} at index ${pivotIndex}`);
          drawArray(c.arr, [], [c.i, c.high], [pivotIndex]);
          // push new segments to stack: right and left
          const leftLow = c.low;
          const leftHigh = pivotIndex - 1;
          const rightLow = pivotIndex + 1;
          const rightHigh = c.high;

          // clear current
          quickState.current = null;

          // push right then left so left is processed next (LIFO)
          if (rightLow < rightHigh)
            quickState.tasks.push({ low: rightLow, high: rightHigh });
          if (leftLow < leftHigh)
            quickState.tasks.push({ low: leftLow, high: leftHigh });

          if (quickState.stepMode) return;
        } else {
          // safety fallback
          quickState.current = null;
        }
      }

      // Dropdown menu expand/collapse on click
      document.querySelectorAll("#topics .dropdown").forEach((dropdown) => {
        dropdown.addEventListener("click", (e) => {
          // Prevent event bubbling to parent clicks
          e.stopPropagation();
          // Close other open dropdowns except this
          document.querySelectorAll("#topics .dropdown").forEach((d) => {
            if (d !== dropdown) d.classList.remove("open");
          });
          dropdown.classList.toggle("open");
        });
      });

      // Handle submenu item clicks to select algorithm
      document
        .querySelectorAll("#topics .dropdown > ul > li")
        .forEach((item) => {
          item.addEventListener("click", (e) => {
            e.stopPropagation();
            // Remove all selected classes first
            document
              .querySelectorAll("#topics li")
              .forEach((li) => li.classList.remove("selected"));
            // Add selected class to clicked submenu item
            item.classList.add("selected");
            currentAlgorithm = item.textContent.trim();
            showAlgorithmInfo(currentAlgorithm);
            resetVisualization();
          });
        });

      // Single non-dropdown items selection
      document
        .querySelectorAll("#topics > li:not(.dropdown)")
        .forEach((item) => {
          item.addEventListener("click", (e) => {
            e.stopPropagation();
            document
              .querySelectorAll("#topics li")
              .forEach((li) => li.classList.remove("selected"));
            item.classList.add("selected");
            currentAlgorithm = item.textContent.trim();
            showAlgorithmInfo(currentAlgorithm);
            resetVisualization();
          });
        });

      userInput.addEventListener("change", () => {
        let input = userInput.value.trim();
        if (!input) return;
        arrayData = input
          .split(",")
          .map((x) => parseInt(x.trim()))
          .filter((n) => !isNaN(n));
        resetVisualization();
      });

      startBtn.addEventListener("click", () => {
        if (!currentAlgorithm || !arrayData.length) {
          alert("Please select an algorithm and enter valid input.");
          return;
        }
        if (currentAlgorithm.toLowerCase() === "bubble sort") startBubbleSort();
        else if (currentAlgorithm.toLowerCase() === "merge sort")
          startMergeSort();
        else if (currentAlgorithm.toLowerCase() === "quick sort")
          startQuickSort();
        else alert("Animation not yet implemented for this algorithm.");
      });
      pauseBtn.addEventListener("click", () => clearTimer());
      stepBtn.addEventListener("click", () => {
        if (!currentAlgorithm) return;
        if (currentAlgorithm.toLowerCase() === "bubble sort") {
          if (!bubbleState) startBubbleSort(true);
          else bubbleSortStep();
        } else if (currentAlgorithm.toLowerCase() === "merge sort") {
          if (!mergeState) startMergeSort(true);
          else mergeSortStep();
        } else if (currentAlgorithm.toLowerCase() === "quick sort") {
          if (!quickState) startQuickSort(true);
          else quickSortStep();
        }
      });
      resetBtn.addEventListener("click", resetVisualization);

      viewAlgoBtn.addEventListener("click", () => {
        if (!currentAlgorithm) {
          alert("Please select an algorithm first.");
          return;
        }
        showModalInfo(currentAlgorithm);
      });

      // Modal controls
      modalClose.addEventListener("click", () => {
        modal.classList.remove("show");
        document.body.classList.remove("modal-open");
      });
      modal.addEventListener("mousedown", (e) => {
        if (e.target === modal) {
          modal.classList.remove("show");
          document.body.classList.remove("modal-open");
        }
      });

      // Show algorithm info in side panel
      function showAlgorithmInfo(algo) {
        if (!algo) return;
        if (algo.toLowerCase() === "bubble sort") {
          algoTitle.textContent = "Bubble Sort";
          algoDesc.textContent =
            "Bubble Sort repeatedly compares adjacent elements and swaps if out of order.";
          algoCode.textContent = `function bubbleSort(arr){
  for(let i=0; i<arr.length-1; i++){
    for(let j=0; j<arr.length-1-i; j++){
      if(arr[j]>arr[j+1]){
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
  return arr;
}`;
        } else if (algo.toLowerCase() === "merge sort") {
          algoTitle.textContent = "Merge Sort";
          algoDesc.textContent =
            "Merge Sort divides the list, recursively sorts halves, and merges sorted halves.";
          algoCode.textContent = `function mergeSort(arr){
  if(arr.length<=1) return arr;
  let mid = Math.floor(arr.length/2);
  let left = mergeSort(arr.slice(0,mid));
  let right = mergeSort(arr.slice(mid));
  return merge(left,right);
}
function merge(left,right){
  let res=[], i=0, j=0;
  while(i<left.length && j<right.length){
    if(left[i]<=right[j]) res.push(left[i++]);
    else res.push(right[j++]);
  }
  return res.concat(left.slice(i)).concat(right.slice(j));
}`;
        } else if (algo.toLowerCase() === "quick sort") {
          algoTitle.textContent = "Quick Sort";
          algoDesc.textContent =
            "Quick Sort picks a pivot, partitions the array around the pivot, and recursively sorts partitions. This visualizer uses an in-place Lomuto partition and performs partitioning step-by-step so you can see individual swaps.";
          algoCode.textContent = `function quickSort(arr, low=0, high=arr.length-1){
  if(low<high){
    let p = partition(arr, low, high);
    quickSort(arr, low, p-1);
    quickSort(arr, p+1, high);
  }
}
function partition(arr, low, high){
  let pivot = arr[high];
  let i = low;
  for(let j=low; j<high; j++){
    if(arr[j] < pivot){
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[high]] = [arr[high], arr[i]];
  return i;
}`;
        } else {
          algoTitle.textContent = algo;
          algoDesc.textContent = "Description not available.";
          algoCode.textContent = "Code not available.";
        }
      }

      // Show algorithm info in modal (View Algo button)
      function showModalInfo(algo) {
        let title = "",
          desc = "",
          code = "";
        if (algo.toLowerCase() === "bubble sort") {
          title = "Bubble Sort";
          desc =
            "Bubble Sort repeatedly compares adjacent elements and swaps if out of order.";
          code = `function bubbleSort(arr){
  for(let i=0; i<arr.length-1; i++){
    for(let j=0; j<arr.length-1-i; j++){
      if(arr[j]>arr[j+1]){
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
      }
    }
  }
  return arr;
}`;
        } else if (algo.toLowerCase() === "merge sort") {
          title = "Merge Sort";
          desc =
            "Merge Sort divides the list, recursively sorts halves, and merges sorted halves.";
          code = `function mergeSort(arr){
  if(arr.length<=1) return arr;
  let mid = Math.floor(arr.length/2);
  let left = mergeSort(arr.slice(0,mid));
  let right = mergeSort(arr.slice(mid));
  return merge(left,right);
}
function merge(left,right){
  let res=[], i=0, j=0;
  while(i<left.length && j<right.length){
    if(left[i]<=right[j]) res.push(left[i++]);
    else res.push(right[j++]);
  }
  return res.concat(left.slice(i)).concat(right.slice(j));
}`;
        } else if (algo.toLowerCase() === "quick sort") {
          title = "Quick Sort";
          desc =
            "Quick Sort picks a pivot, partitions the array around the pivot, and recursively sorts partitions. This visualizer uses an in-place Lomuto partition and performs partitioning step-by-step so you can see individual swaps.";
          code = `function quickSort(arr, low=0, high=arr.length-1){
  if(low<high){
    let p = partition(arr, low, high);
    quickSort(arr, low, p-1);
    quickSort(arr, p+1, high);
  }
}
function partition(arr, low, high){
  let pivot = arr[high];
  let i = low;
  for(let j=low; j<high; j++){
    if(arr[j] < pivot){
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[high]] = [arr[high], arr[i]];
  return i;
}`;
        } else {
          title = algo;
          desc = "Description not available.";
          code = "Code not available.";
        }
        algoModalTitle.textContent = title;
        algoModalDesc.innerHTML = `
      <h3>About</h3>
      <p>${desc}</p>
      <h3>Algorithm Code</h3>
      <pre>${code}</pre>
    `;
        modal.classList.add("show");
        document.body.classList.add("modal-open");
      }

      // Initialize
      drawArray([]);