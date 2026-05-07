import { $, $$ } from './dom.js';
import { state } from './state.js';
import { sleep } from './utils.js';

export function renderArray(comparing = [], swapping = [], sorted = []) {
  const canvas = $("#vizCanvas");
  if (!canvas) return;
  canvas.innerHTML = "";

  const maxValue = Math.max(...state.array, 1);
  state.array.forEach((val, index) => {
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

  if (state.useGSAP && window.gsap) {
    window.gsap.fromTo(
      "#vizCanvas .array-bar .bar",
      { y: 30, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power2.out", stagger: 0.02 }
    );
  }
}

export async function animateSwap(idxA, idxB) {
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

  if (state.useGSAP && window.gsap && barA && barB) {
    await Promise.all([
      window.gsap.to(barA, { y: -28, rotate: 6, duration: Math.max(0.08, state.animationSpeed / 1500), ease: "power1.out" }),
      window.gsap.to(barB, { y: -28, rotate: -6, duration: Math.max(0.08, state.animationSpeed / 1500), ease: "power1.out" })
    ]);

    const hA = barA.style.height;
    const hB = barB.style.height;

    await Promise.all([
      window.gsap.to(barA, { height: hB, duration: Math.max(0.15, state.animationSpeed / 1000), ease: "elastic.out(1,0.6)" }),
      window.gsap.to(barB, { height: hA, duration: Math.max(0.15, state.animationSpeed / 1000), ease: "elastic.out(1,0.6)" })
    ]);

    if (labelA && labelB) {
      const tA = labelA.textContent;
      labelA.textContent = labelB.textContent;
      labelB.textContent = tA;
    }

    await Promise.all([
      window.gsap.to(barA, { y: 0, rotate: 0, duration: Math.max(0.08, state.animationSpeed / 2000), ease: "power2.in" }),
      window.gsap.to(barB, { y: 0, rotate: 0, duration: Math.max(0.08, state.animationSpeed / 2000), ease: "power2.in" })
    ]);
  } else {
    if (barA && barB && labelA && labelB) {
      const tmpH = barA.style.height;
      const tmpT = labelA.textContent;
      barA.style.height = barB.style.height;
      labelA.textContent = labelB.textContent;
      barB.style.height = tmpH;
      labelB.textContent = tmpT;
    }
    await sleep(Math.max(80, state.animationSpeed / 3));
  }
}

export function renderTree(activeIdx = -1, visitedIndices = []) {
  const canvas = $("#vizCanvas");
  if (!canvas) return;
  canvas.innerHTML = "";

  const n = state.array.length;
  if (n === 0) return;

  const width = canvas.clientWidth || 800;
  const height = canvas.clientHeight || 400;

  // Build an SVG for the edges
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "tree-edge");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  canvas.appendChild(svg);

  // Determine positions for a binary tree
  // root at index 0, left child 2*i + 1, right child 2*i + 2
  const positions = [];
  const levelHeight = 60;
  const nodeRadius = 20;

  function getDepth(idx) {
    return Math.floor(Math.log2(idx + 1));
  }
  
  const maxDepth = getDepth(n - 1);

  for (let i = 0; i < n; i++) {
    const depth = getDepth(i);
    const nodesInLevel = Math.pow(2, depth);
    const indexInLevel = i - (nodesInLevel - 1);
    
    // Distribute nodes evenly across the width
    const levelWidth = width / (nodesInLevel + 1);
    const x = levelWidth * (indexInLevel + 1);
    const y = 40 + depth * levelHeight;
    
    positions[i] = { x, y };

    // Draw edge to parent if not root
    if (i > 0) {
      const parentIdx = Math.floor((i - 1) / 2);
      const parentPos = positions[parentIdx];
      
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", parentPos.x);
      line.setAttribute("y1", parentPos.y);
      line.setAttribute("x2", x);
      line.setAttribute("y2", y);
      
      if (activeIdx === i || visitedIndices.includes(i)) {
        line.classList.add("highlight");
      }
      svg.appendChild(line);
    }
  }

  // Draw the nodes
  for (let i = 0; i < n; i++) {
    const pos = positions[i];
    
    const node = document.createElement("div");
    node.className = "tree-node";
    node.style.left = `${pos.x - nodeRadius}px`;
    node.style.top = `${pos.y - nodeRadius}px`;
    node.textContent = state.array[i];

    if (activeIdx === i) {
      node.classList.add("highlight");
    } else if (visitedIndices.includes(i)) {
      node.classList.add("visited");
    }

    canvas.appendChild(node);
  }

  if (state.useGSAP && window.gsap && activeIdx === -1 && visitedIndices.length === 0) {
    window.gsap.fromTo(
      "#vizCanvas .tree-node",
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.7)" }
    );
  }
}

export function renderGraph(activeNode = -1, visitedNodes = [], activeEdges = [], shortestPath = [], distances = {}) {
  const canvas = $("#vizCanvas");
  if (!canvas) return;
  canvas.innerHTML = "";

  const n = state.array.length;
  if (n === 0) return;

  const width = canvas.clientWidth || 800;
  const height = canvas.clientHeight || 400;
  const radius = Math.min(width, height) / 2 - 40;
  const centerX = width / 2;
  const centerY = height / 2;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "tree-edge");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  canvas.appendChild(svg);

  // Compute node positions
  const positions = [];
  for (let i = 0; i < n; i++) {
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
    positions.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    });
  }

  // Draw edges
  state.graphEdges.forEach((edge) => {
    const uPos = positions[edge.u];
    const vPos = positions[edge.v];
    const midX = (uPos.x + vPos.x) / 2;
    const midY = (uPos.y + vPos.y) / 2;

    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", uPos.x);
    line.setAttribute("y1", uPos.y);
    line.setAttribute("x2", vPos.x);
    line.setAttribute("y2", vPos.y);

    const isPath = shortestPath.some((p, i) => i > 0 && ((shortestPath[i-1] === edge.u && p === edge.v) || (shortestPath[i-1] === edge.v && p === edge.u)));
    const isActive = activeEdges.some(e => (e.u === edge.u && e.v === edge.v) || (e.u === edge.v && e.v === edge.u));

    if (isPath) {
      line.classList.add("path");
    } else if (isActive) {
      line.classList.add("highlight");
    }
    svg.appendChild(line);

    // Draw weight
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", midX);
    text.setAttribute("y", midY - 5);
    text.setAttribute("class", "edge-weight");
    text.setAttribute("text-anchor", "middle");
    text.textContent = edge.weight;
    svg.appendChild(text);
  });

  // Draw nodes
  for (let i = 0; i < n; i++) {
    const pos = positions[i];
    
    const node = document.createElement("div");
    node.className = "tree-node";
    node.style.left = `${pos.x - 20}px`;
    node.style.top = `${pos.y - 20}px`;
    node.textContent = state.array[i];

    if (activeNode === i) {
      node.classList.add("highlight");
    } else if (visitedNodes.includes(i) || shortestPath.includes(i)) {
      node.classList.add("visited");
    }

    // Display distance above node if available
    if (distances[i] !== undefined && distances[i] !== Infinity) {
      const distLabel = document.createElement("div");
      distLabel.className = "bar-value highlight";
      distLabel.style.position = "absolute";
      distLabel.style.left = `${pos.x - 20}px`;
      distLabel.style.top = `${pos.y + 25}px`;
      distLabel.textContent = `d:${distances[i]}`;
      canvas.appendChild(distLabel);
    }

    canvas.appendChild(node);
  }
}
