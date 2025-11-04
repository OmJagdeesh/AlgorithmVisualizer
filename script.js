
      // Global variables
      let array = [64, 34, 25, 12, 22, 11, 90];
      let currentAlgorithm = "bubble";
      let animationSpeed = 1000;
      let isAnimating = false;
      let isPaused = false;
      let animationTimeouts = [];

      // Algorithm information
      const algorithmInfo = {
        bubble: {
          title: "Bubble Sort",
          description:
            "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
          timeBest: "O(n)",
          timeAvg: "O(n²)",
          timeWorst: "O(n²)",
          space: "O(1)",
          code: `function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`,
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
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        }
    }
    return arr;
}`,
        },
        insertion: {
          title: "Insertion Sort",
          description:
            "Insertion Sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms.",
          timeBest: "O(n)",
          timeAvg: "O(n²)",
          timeWorst: "O(n²)",
          space: "O(1)",
          code: `function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`,
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
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    let result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
}`,
        },
        quick: {
          title: "Quick Sort",
          description:
            "Quick Sort is a divide-and-conquer algorithm that picks a pivot element and partitions the array around it.",
          timeBest: "O(n log n)",
          timeAvg: "O(n log n)",
          timeWorst: "O(n²)",
          space: "O(log n)",
          code: `function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`,
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
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;
        }
    }
    return -1;
}`,
        },
        binary: {
          title: "Binary Search",
          description:
            "Binary Search is a search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.",
          timeBest: "O(1)",
          timeAvg: "O(log n)",
          timeWorst: "O(log n)",
          space: "O(1)",
          code: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}`,
        },
      };

      // Initialize
      document.addEventListener("DOMContentLoaded", () => {
        createParticles();
        renderArray();
        updateAlgorithmInfo();

        // Event listeners
        document
          .getElementById("startBtn")
          .addEventListener("click", startAnimation);
        document
          .getElementById("pauseBtn")
          .addEventListener("click", pauseAnimation);
        document
          .getElementById("resetBtn")
          .addEventListener("click", resetAnimation);
        document
          .getElementById("generateBtn")
          .addEventListener("click", generateRandomArray);
        document
          .getElementById("arrayInput")
          .addEventListener("change", handleArrayInput);
        document
          .getElementById("speedSlider")
          .addEventListener("input", handleSpeedChange);

        // Algorithm buttons
        document.querySelectorAll(".algo-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            document
              .querySelectorAll(".algo-btn")
              .forEach((b) => b.classList.remove("active"));
            e.target.classList.add("active");
            currentAlgorithm = e.target.dataset.algo;
            resetAnimation();
            updateAlgorithmInfo();
          });
        });
      });

      // Create floating particles
      function createParticles() {
  const particlesContainer = document.getElementById("particles");
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + "%";
    particle.style.width = Math.random() * 10 + 5 + "px";
    particle.style.height = particle.style.width;
    particle.style.background = `radial-gradient(circle, rgba(255, 255, 255, ${
      Math.random() * 0.5 + 0.3
    }), transparent)`;
    particle.style.animationDelay = Math.random() * 20 + "s";
    particle.style.animationDuration = Math.random() * 20 + 20 + "s";
    particlesContainer.appendChild(particle);
  }
}


      // Render array
      function renderArray(comparing = [], swapping = [], sorted = []) {
        const canvas = document.getElementById("vizCanvas");
        canvas.innerHTML = "";

        const maxValue = Math.max(...array);

        array.forEach((value, index) => {
          const barContainer = document.createElement("div");
          barContainer.className = "array-bar";

          const bar = document.createElement("div");
          bar.className = "bar";
          const height = (value / maxValue) * 300;
          bar.style.height = height + "px";

          if (sorted.includes(index)) {
            bar.classList.add("sorted");
          } else if (swapping.includes(index)) {
            bar.classList.add("swapping");
          } else if (comparing.includes(index)) {
            bar.classList.add("comparing");
          }

          const valueLabel = document.createElement("div");
          valueLabel.className = "bar-value";
          valueLabel.textContent = value;
          if (comparing.includes(index) || swapping.includes(index)) {
            valueLabel.classList.add("highlight");
          }

          barContainer.appendChild(bar);
          barContainer.appendChild(valueLabel);
          canvas.appendChild(barContainer);
        });
      }

      // Update algorithm information
      function updateAlgorithmInfo() {
        const info = algorithmInfo[currentAlgorithm];
        document.getElementById("algoTitle").textContent = info.title;
        document.getElementById("algoDescription").textContent =
          info.description;
        document.getElementById("timeBest").textContent = info.timeBest;
        document.getElementById("timeAvg").textContent = info.timeAvg;
        document.getElementById("timeWorst").textContent = info.timeWorst;
        document.getElementById("space").textContent = info.space;
        document.getElementById("codeSnippet").textContent = info.code;
      }

      // Handle array input
      function handleArrayInput(e) {
        const input = e.target.value.trim();
        if (input) {
          const nums = input
            .split(",")
            .map((n) => parseInt(n.trim()))
            .filter((n) => !isNaN(n));
          if (nums.length > 0) {
            array = nums.slice(0, 15); // Limit to 15 elements for visualization
            resetAnimation();
          }
        }
      }

      // Generate random array
      function generateRandomArray() {
        const size = Math.floor(Math.random() * 8) + 8; // 8-15 elements
        array = Array.from(
          { length: size },
          () => Math.floor(Math.random() * 99) + 1
        );
        document.getElementById("arrayInput").value = array.join(", ");
        resetAnimation();
      }

      // Handle speed change
      function handleSpeedChange(e) {
        animationSpeed = 2100 - e.target.value; // Inverse for intuitive control
        document.getElementById("speedValue").textContent =
          (animationSpeed / 1000).toFixed(1) + "s";
      }

      // Animation controls
      function startAnimation() {
        if (isAnimating) return;

        isAnimating = true;
        isPaused = false;
        document.getElementById("startBtn").disabled = true;
        document.getElementById("statusMessage").textContent = "Sorting...";
        document.getElementById("statusMessage").className =
          "status-message warning";

        switch (currentAlgorithm) {
          case "bubble":
            bubbleSort();
            break;
          case "selection":
            selectionSort();
            break;
          case "insertion":
            insertionSort();
            break;
          case "merge":
            mergeSortAnimation();
            break;
          case "quick":
            quickSortAnimation();
            break;
          case "linear":
          case "binary":
            searchAnimation();
            break;
        }
      }

      function pauseAnimation() {
        isPaused = !isPaused;
        document.getElementById("pauseBtn").textContent = isPaused
          ? "▶ Resume"
          : "⏸ Pause";
      }

      function resetAnimation() {
        isAnimating = false;
        isPaused = false;
        animationTimeouts.forEach((timeout) => clearTimeout(timeout));
        animationTimeouts = [];
        document.getElementById("startBtn").disabled = false;
        document.getElementById("pauseBtn").textContent = "⏸ Pause";
        renderArray();
        document.getElementById("statusMessage").textContent =
          "Ready to visualize";
        document.getElementById("statusMessage").className = "status-message";
      }

      // Bubble Sort Animation
      async function bubbleSort() {
        const arr = [...array];
        const n = arr.length;
        let sorted = [];

        for (let i = 0; i < n - 1; i++) {
          for (let j = 0; j < n - i - 1; j++) {
            if (!isAnimating) return;
            while (isPaused) {
              await sleep(100);
            }

            renderArray([j, j + 1], [], sorted);
            await sleep(animationSpeed);

            if (arr[j] > arr[j + 1]) {
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              array = [...arr];
              renderArray([], [j, j + 1], sorted);
              await sleep(animationSpeed);
            }
          }
          sorted.push(n - i - 1);
        }
        sorted.push(0);

        finishAnimation(sorted);
      }

      // Selection Sort Animation
      async function selectionSort() {
        const arr = [...array];
        const n = arr.length;
        let sorted = [];

        for (let i = 0; i < n - 1; i++) {
          let minIdx = i;

          for (let j = i + 1; j < n; j++) {
            if (!isAnimating) return;
            while (isPaused) {
              await sleep(100);
            }

            renderArray([minIdx, j], [], sorted);
            await sleep(animationSpeed);

            if (arr[j] < arr[minIdx]) {
              minIdx = j;
            }
          }

          if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            array = [...arr];
            renderArray([], [i, minIdx], sorted);
            await sleep(animationSpeed);
          }

          sorted.push(i);
        }
        sorted.push(n - 1);

        finishAnimation(sorted);
      }

      // Insertion Sort Animation
      async function insertionSort() {
        const arr = [...array];
        const n = arr.length;
        let sorted = [0];

        for (let i = 1; i < n; i++) {
          let key = arr[i];
          let j = i - 1;

          while (j >= 0 && arr[j] > key) {
            if (!isAnimating) return;
            while (isPaused) {
              await sleep(100);
            }

            renderArray([j, j + 1], [], sorted);
            await sleep(animationSpeed);

            arr[j + 1] = arr[j];
            array = [...arr];
            renderArray([], [j, j + 1], sorted);
            await sleep(animationSpeed);

            j--;
          }

          arr[j + 1] = key;
          array = [...arr];
          sorted.push(i);
          renderArray([], [], sorted);
          await sleep(animationSpeed);
        }

        finishAnimation(Array.from({ length: n }, (_, i) => i));
      }

      // Merge Sort Animation (simplified)
      async function mergeSortAnimation() {
        // For simplicity, we'll show a basic visualization
        const arr = [...array];
        const n = arr.length;

        // Simulate merge sort with visual feedback
        for (let size = 1; size < n; size *= 2) {
          for (let start = 0; start < n - 1; start += 2 * size) {
            if (!isAnimating) return;
            while (isPaused) {
              await sleep(100);
            }

            const mid = Math.min(start + size - 1, n - 1);
            const end = Math.min(start + 2 * size - 1, n - 1);

            // Highlight the subarrays being merged
            const comparing = [];
            for (let i = start; i <= end; i++) {
              comparing.push(i);
            }
            renderArray(comparing, [], []);
            await sleep(animationSpeed);

            // Merge the subarrays
            merge(arr, start, mid, end);
            array = [...arr];
            renderArray([], comparing, []);
            await sleep(animationSpeed);
          }
        }

        finishAnimation(Array.from({ length: n }, (_, i) => i));
      }

      function merge(arr, left, mid, right) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);

        let i = 0,
          j = 0,
          k = left;

        while (i < leftArr.length && j < rightArr.length) {
          if (leftArr[i] <= rightArr[j]) {
            arr[k++] = leftArr[i++];
          } else {
            arr[k++] = rightArr[j++];
          }
        }

        while (i < leftArr.length) {
          arr[k++] = leftArr[i++];
        }

        while (j < rightArr.length) {
          arr[k++] = rightArr[j++];
        }
      }

      // Quick Sort Animation (simplified)
      async function quickSortAnimation() {
        const arr = [...array];
        await quickSortHelper(arr, 0, arr.length - 1);
        finishAnimation(Array.from({ length: arr.length }, (_, i) => i));
      }

      async function quickSortHelper(arr, low, high) {
        if (low < high) {
          if (!isAnimating) return;
          while (isPaused) {
            await sleep(100);
          }

          const pivotIndex = await partition(arr, low, high);
          await quickSortHelper(arr, low, pivotIndex - 1);
          await quickSortHelper(arr, pivotIndex + 1, high);
        }
      }

      async function partition(arr, low, high) {
        const pivot = arr[high];
        let i = low - 1;

        renderArray([high], [], []);
        await sleep(animationSpeed);

        for (let j = low; j < high; j++) {
          if (!isAnimating) return i + 1;
          while (isPaused) {
            await sleep(100);
          }

          renderArray([j, high], [], []);
          await sleep(animationSpeed / 2);

          if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            array = [...arr];
            renderArray([], [i, j], []);
            await sleep(animationSpeed);
          }
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        array = [...arr];
        renderArray([], [i + 1, high], []);
        await sleep(animationSpeed);

        return i + 1;
      }

      // Search Animation
      async function searchAnimation() {
        const target = prompt("Enter a number to search:");
        if (!target) return;

        const targetNum = parseInt(target);
        if (isNaN(targetNum)) {
          alert("Please enter a valid number");
          return;
        }

        document.getElementById(
          "statusMessage"
        ).textContent = `Searching for ${targetNum}...`;

        if (currentAlgorithm === "binary") {
          // Sort array first for binary search
          array.sort((a, b) => a - b);
          renderArray();
          await sleep(1000);
        }

        const index =
          currentAlgorithm === "linear"
            ? await linearSearch(targetNum)
            : await binarySearch(targetNum);

        if (index !== -1) {
          renderArray([], [], [index]);
          document.getElementById(
            "statusMessage"
          ).textContent = `Found ${targetNum} at index ${index}!`;
          document.getElementById("statusMessage").className =
            "status-message success";
        } else {
          document.getElementById(
            "statusMessage"
          ).textContent = `${targetNum} not found in the array`;
          document.getElementById("statusMessage").className = "status-message";
        }

        isAnimating = false;
        document.getElementById("startBtn").disabled = false;
      }

      async function linearSearch(target) {
        for (let i = 0; i < array.length; i++) {
          if (!isAnimating) return -1;
          while (isPaused) {
            await sleep(100);
          }

          renderArray([i], [], []);
          await sleep(animationSpeed);

          if (array[i] === target) {
            return i;
          }
        }
        return -1;
      }

      async function binarySearch(target) {
        let left = 0;
        let right = array.length - 1;

        while (left <= right) {
          if (!isAnimating) return -1;
          while (isPaused) {
            await sleep(100);
          }

          const mid = Math.floor((left + right) / 2);

          // Highlight search range
          const range = [];
          for (let i = left; i <= right; i++) {
            range.push(i);
          }
          renderArray(range, [mid], []);
          await sleep(animationSpeed);

          if (array[mid] === target) {
            return mid;
          } else if (array[mid] < target) {
            left = mid + 1;
          } else {
            right = mid - 1;
          }
        }

        return -1;
      }

      // Finish animation
      function finishAnimation(sortedIndices) {
        renderArray([], [], sortedIndices);
        document.getElementById("statusMessage").textContent =
          "Sorting complete!";
        document.getElementById("statusMessage").className =
          "status-message success";
        isAnimating = false;
        document.getElementById("startBtn").disabled = false;
      }

      // Helper function
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
