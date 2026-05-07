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
  },
  preorder: {
    title: "Pre-order Traversal",
    description: "Pre-order traversal visits the current node first, then recursively visits the left subtree, followed by the right subtree. Used to create a copy of the tree or get prefix expressions.",
    timeBest: "O(n)",
    timeAvg: "O(n)",
    timeWorst: "O(n)",
    space: "O(h)",
    code: `function preorder(node) {
  if (!node) return;
  visit(node);
  preorder(node.left);
  preorder(node.right);
}`
  },
  inorder: {
    title: "In-order Traversal",
    description: "In-order traversal recursively visits the left subtree, then the current node, and finally the right subtree. For Binary Search Trees, it retrieves data in sorted order.",
    timeBest: "O(n)",
    timeAvg: "O(n)",
    timeWorst: "O(n)",
    space: "O(h)",
    code: `function inorder(node) {
  if (!node) return;
  inorder(node.left);
  visit(node);
  inorder(node.right);
}`
  },
  postorder: {
    title: "Post-order Traversal",
    description: "Post-order traversal recursively visits the left subtree, then the right subtree, and finally the current node. Used to delete a tree or get postfix expressions.",
    timeBest: "O(n)",
    timeAvg: "O(n)",
    timeWorst: "O(n)",
    space: "O(h)",
    code: `function postorder(node) {
  if (!node) return;
  postorder(node.left);
  postorder(node.right);
  visit(node);
}`
  },
  dijkstra: {
    title: "Dijkstra's Algorithm",
    description: "Dijkstra's algorithm finds the shortest paths between nodes in a graph. It picks the unvisited vertex with the lowest distance, calculates the distance through it to each unvisited neighbor, and updates the neighbor's distance if smaller.",
    timeBest: "O((V+E) log V)",
    timeAvg: "O((V+E) log V)",
    timeWorst: "O((V+E) log V)",
    space: "O(V)",
    code: `function dijkstra(graph, start) {
  const dist = {};
  const pq = new PriorityQueue();
  pq.enqueue(start, 0);
  dist[start] = 0;
  
  while (!pq.isEmpty()) {
    const {node, d} = pq.dequeue();
    if (d > dist[node]) continue;
    for (let neighbor of graph[node]) {
      let newDist = dist[node] + neighbor.weight;
      if (newDist < dist[neighbor.node]) {
        dist[neighbor.node] = newDist;
        pq.enqueue(neighbor.node, newDist);
      }
    }
  }
}`
  }
};

state.graphEdges = [];
