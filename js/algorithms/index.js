import { bubbleSortAnim, selectionSortAnim, insertionSortAnim, mergeSortAnim, quickSortAnim } from './sorting.js';
import { searchAnim } from './searching.js';
import { preorderAnim, inorderAnim, postorderAnim } from './trees.js';
import { setStatus } from '../ui.js';
import { state } from '../state.js';
import { $ } from '../dom.js';

export async function runAlgorithm(algo) {
  try {
    switch (algo) {
      case "bubble": await bubbleSortAnim(); break;
      case "selection": await selectionSortAnim(); break;
      case "insertion": await insertionSortAnim(); break;
      case "merge": await mergeSortAnim(); break;
      case "quick": await quickSortAnim(); break;
      case "linear":
      case "binary":
        await searchAnim();
        break;
      case "preorder": await preorderAnim(); break;
      case "inorder": await inorderAnim(); break;
      case "postorder": await postorderAnim(); break;
      default:
        setStatus("Unknown algorithm", "");
        state.isAnimating = false;
        const startBtn = $("#startBtn");
        if (startBtn) startBtn.disabled = false;
    }
  } catch (e) {
    console.error("Algorithm animation error:", e);
  }
}
