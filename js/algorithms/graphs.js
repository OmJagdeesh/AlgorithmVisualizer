import { state } from '../state.js';
import { renderGraph } from '../visualizer.js';
import { waitWhilePaused, sleep } from '../utils.js';
import { finishAnimation } from '../ui.js';

export async function dijkstraAnim() {
  const n = state.array.length;
  if (n === 0) return;

  const startNode = 0;
  const targetNode = n - 1;

  // Build adjacency list
  const adj = Array.from({ length: n }, () => []);
  state.graphEdges.forEach(edge => {
    adj[edge.u].push({ node: edge.v, weight: edge.weight });
    adj[edge.v].push({ node: edge.u, weight: edge.weight }); // Undirected graph
  });

  const distances = Array(n).fill(Infinity);
  const previous = Array(n).fill(null);
  const visited = [];
  
  distances[startNode] = 0;
  
  // Simple array-based priority queue
  const queue = [{ node: startNode, d: 0 }];

  while (queue.length > 0) {
    if (!state.isAnimating) return;
    await waitWhilePaused();

    // Get node with minimum distance
    queue.sort((a, b) => a.d - b.d);
    const { node: u, d } = queue.shift();

    if (visited.includes(u)) continue;
    
    // Visit node
    renderGraph(u, visited, [], [], distances);
    await sleep(Math.max(200, state.animationSpeed));
    
    visited.push(u);

    if (u === targetNode) break;

    // Explore neighbors
    for (let neighbor of adj[u]) {
      const v = neighbor.node;
      const weight = neighbor.weight;

      if (!visited.includes(v)) {
        if (!state.isAnimating) return;
        await waitWhilePaused();

        // Highlight edge being evaluated
        renderGraph(u, visited, [{ u, v }], [], distances);
        await sleep(Math.max(150, state.animationSpeed / 1.5));

        const newDist = distances[u] + weight;
        if (newDist < distances[v]) {
          distances[v] = newDist;
          previous[v] = u;
          queue.push({ node: v, d: newDist });
          
          renderGraph(v, visited, [{ u, v }], [], distances);
          await sleep(Math.max(150, state.animationSpeed / 1.5));
        }
      }
    }
  }

  // Backtrack to find shortest path
  const path = [];
  let curr = targetNode;
  if (previous[curr] !== null || curr === startNode) {
    while (curr !== null) {
      path.unshift(curr);
      curr = previous[curr];
    }
  }

  if (state.isAnimating) {
    renderGraph(-1, visited, [], path, distances);
    finishAnimation(`Shortest Path: ${path.join(" → ")} (Distance: ${distances[targetNode] !== Infinity ? distances[targetNode] : "Unreachable"})`);
  }
}
