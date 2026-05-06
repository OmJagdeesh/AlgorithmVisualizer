export const state = {
  array: [64, 34, 25, 12, 22, 11, 90],
  currentAlgorithm: "bubble",
  animationSpeed: 1000,
  isAnimating: false,
  isPaused: false,
  animationHandles: [],
  useGSAP: typeof window.gsap !== "undefined"
};

export const algorithmInfo = {
  bubble: {
    title: "Bubble Sort",
    description: "Bubble Sort repeatedly goes through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
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
    description: "Selection Sort divides the input list into a sorted and an unsorted region, and repeatedly selects the smallest element from the unsorted region to add to the sorted region.",
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
    description: "Insertion Sort builds the final sorted array one item at a time. It is efficient for small lists and mostly-sorted lists.",
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
    description: "Merge Sort is a divide-and-conquer algorithm that divides the list into smaller sublists, sorts them, and then merges them back together.",
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
    description: "Quick Sort picks a pivot element and partitions the array around it, then recursively sorts the partitions.",
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
    description: "Linear Search sequentially checks each element of the list until a match is found or the whole list has been searched.",
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
    description: "Binary Search finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.",
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
