import { $, $$ } from './js/dom.js';
import { createParticles, updateAlgorithmInfo } from './js/ui.js';
import { renderArray } from './js/visualizer.js';
import { startAnimation, pauseAnimation, resetAll, generateRandomArray, handleArrayInput, handleSpeedChange } from './js/controls.js';
import { toggleVoice, setupVoiceRecognition } from './js/voice.js';
import { state } from './js/state.js';

document.addEventListener("DOMContentLoaded", () => {
  createParticles();
  renderArray();
  updateAlgorithmInfo();

  const startBtn = $("#startBtn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      if (!state.isAnimating) startAnimation();
    });
  }

  const pauseBtn = $("#pauseBtn");
  if (pauseBtn) pauseBtn.addEventListener("click", pauseAnimation);

  const resetBtn = $("#resetBtn");
  if (resetBtn) resetBtn.addEventListener("click", resetAll);

  const generateBtn = $("#generateBtn");
  if (generateBtn) generateBtn.addEventListener("click", generateRandomArray);

  const arrayInput = $("#arrayInput");
  if (arrayInput) arrayInput.addEventListener("change", handleArrayInput);

  const speedSlider = $("#speedSlider");
  if (speedSlider) speedSlider.addEventListener("input", handleSpeedChange);

  $$(".algo-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      $$(".algo-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.currentAlgorithm = btn.dataset.algo;
      updateAlgorithmInfo();
      resetAll();
    });
  });

  const voiceBtn = $("#voiceBtn");
  if (voiceBtn) voiceBtn.addEventListener("click", toggleVoice);

  if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    setupVoiceRecognition();
  } else {
    console.info("SpeechRecognition API unavailable.");
  }
});
