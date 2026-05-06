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
