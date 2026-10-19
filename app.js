// Note: Vibe-coded due to unforeseen complexity
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playNote(frequency, element) {
  initAudio();
  if (!audioCtx) return;

  element.setAttribute('data-press', 'active');

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  const now = audioCtx.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.03);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 2.5);

  setTimeout(() => {
    element.removeAttribute('data-press');
  }, 150);
}

const keyMap = {
  'z': { selector: '[data-note="C3"]', freq: 130.81 },
  'x': { selector: '[data-note="D3"]', freq: 146.83 },
  'c': { selector: '[data-note="E3"]', freq: 164.81 },
  'v': { selector: '[data-note="F3"]', freq: 174.61 },
  'b': { selector: '[data-note="G3"]', freq: 196.00 },
  'n': { selector: '[data-note="A3"]', freq: 220.00 },
  'm': { selector: '[data-note="B3"]', freq: 246.94 },

  's': { selector: '[data-note="C#3"]', freq: 138.59 },
  'd': { selector: '[data-note="Eb3"]', freq: 155.56 },
  'g': { selector: '[data-note="F#3"]', freq: 185.00 },
  'h': { selector: '[data-note="G#3"]', freq: 207.65 },
  'j': { selector: '[data-note="Bb3"]', freq: 233.08 },

  'q': { selector: '[data-note="C4"]', freq: 261.63 },
  'w': { selector: '[data-note="D4"]', freq: 293.66 },
  'e': { selector: '[data-note="E4"]', freq: 329.63 },
  'r': { selector: '[data-note="F4"]', freq: 349.23 },
  't': { selector: '[data-note="G4"]', freq: 392.00 },
  'y': { selector: '[data-note="A4"]', freq: 440.00 },
  'u': { selector: '[data-note="B4"]', freq: 493.88 },

  '2': { selector: '[data-note="C#4"]', freq: 277.18 },
  '3': { selector: '[data-note="Eb4"]', freq: 311.13 },
  '5': { selector: '[data-note="F#4"]', freq: 369.99 },
  '6': { selector: '[data-note="G#4"]', freq: 415.30 },
  '7': { selector: '[data-note="Bb4"]', freq: 466.16 }
};

document.querySelectorAll('.piano-key-white-wrap, .piano-key-black').forEach(keyEl => {
  const freq = parseFloat(keyEl.getAttribute('data-freq'));
  keyEl.addEventListener('mousedown', () => {
    playNote(freq, keyEl);
  });
});

const activeKeys = new Set();

window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.repeat) return; 

  const key = e.key.toLowerCase();
  if (keyMap[key] && !activeKeys.has(key)) {
    activeKeys.add(key);
    const mapping = keyMap[key];
    const el = document.querySelector(mapping.selector);
    if (el) {
      playNote(mapping.freq, el);
    }
  }
});

window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  activeKeys.delete(key);
});