import { $, $$ } from './dom.js';
import { setStatus, updateAlgorithmInfo } from './ui.js';
import { startAnimation, pauseAnimation, resetAll, generateRandomArray } from './controls.js';
import { state } from './state.js';

let recognition = null;
let voiceActive = false;

export function setupVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
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
    if (voiceActive) {
      try {
        recognition.start();
      } catch (e) {}
    }
  };
}

export function handleVoiceTranscript(text) {
  if (text.includes("start")) {
    if (text.includes("bubble")) selectAndStart("bubble");
    else if (text.includes("selection")) selectAndStart("selection");
    else if (text.includes("insertion")) selectAndStart("insertion");
    else if (text.includes("merge")) selectAndStart("merge");
    else if (text.includes("quick")) selectAndStart("quick");
    else if (text.includes("linear")) selectAndStart("linear");
    else if (text.includes("binary")) selectAndStart("binary");
    else {
      startAnimation();
    }
  } else if (text.includes("pause")) {
    pauseAnimation();
  } else if (text.includes("resume")) {
    if (state.isPaused) pauseAnimation();
  } else if (text.includes("reset")) {
    resetAll();
  } else if (text.includes("generate") || text.includes("random") || text.includes("new array")) {
    generateRandomArray();
  } else if (text.includes("set speed")) {
    const numMatch = text.match(/(\d+(\.\d+)?)/);
    if (numMatch) {
      const seconds = parseFloat(numMatch[0]);
      if (!isNaN(seconds)) {
        state.animationSpeed = Math.max(80, Math.min(2000, seconds * 1000));
        const val = 2100 - state.animationSpeed;
        const slider = $("#speedSlider");
        if (slider) slider.value = val;
        const speedValEl = $("#speedValue");
        if (speedValEl) speedValEl.textContent = (state.animationSpeed / 1000).toFixed(1) + "s";
      }
    }
  } else {
    console.log("Unrecognized voice command:", text);
  }
}

export function selectAndStart(algo) {
  $$(".algo-btn").forEach((b) => b.classList.remove("active"));
  const btn = $(`.algo-btn[data-algo="${algo}"]`);
  if (btn) btn.classList.add("active");
  state.currentAlgorithm = algo;
  resetAll();
  updateAlgorithmInfo();
  startAnimation();
}

export function toggleVoice() {
  const btn = $("#voiceBtn");
  if (!btn) return;
  voiceActive = !voiceActive;
  if (voiceActive) {
    btn.classList.add("active");
    btn.textContent = "🎙 Listening...";
    if (!recognition) setupVoiceRecognition();
    try {
      recognition.start();
    } catch (e) {}
    setStatus("Voice: Listening...", "warning");
  } else {
    btn.classList.remove("active");
    btn.textContent = "🎤 Voice";
    if (recognition) recognition.stop();
    setStatus("Voice: Off", "");
  }
}
