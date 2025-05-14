// Synthesizer setup using the Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscillator, gainNode;

const scales = {
    "12tet": [1, 1.059463, 1.122462, 1.189207, 1.259921, 1.334839, 1.414214, 1.498307, 1.587401, 1.681793, 1.781797, 1.887748],
    "31edo": [1, 1.0232558, 1.0465116, 1.0697674, 1.0930233, 1.1162791, 1.1395349, 1.1627907, 1.1860465, 1.2093023, 1.2325581, 1.2558139, /* more... */],
    "just-intonation": [1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8, 2, 9/5, 5/2, 3, 15/7] // Just Intonation example
};

let currentScale = scales['12tet']; // Default scale

// Create oscillator and gain node
function createSound() {
    oscillator = audioContext.createOscillator();
    gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine';
    gainNode.gain.value = 0.1; // Set volume
}

// Function to play a note
function playNote(frequency) {
    createSound();
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1); // Stop after 1 second
}

// Create the virtual keyboard
function createKeyboard() {
    const keyboardContainer = document.getElementById('keyboard-container');
    const numKeys = 36; // For example, a 3-octave keyboard

    for (let i = 0; i < numKeys; i++) {
        const keyDiv = document.createElement('div');
        const isBlackKey = (i % 12 === 1 || i % 12 === 3 || i % 12 === 6 || i % 12 === 8 || i % 12 === 10);
        
        keyDiv.className = isBlackKey ? 'black-key' : 'white-key';
        keyDiv.dataset.key = i;
        keyDiv.addEventListener('mousedown', () => {
            const frequency = getFrequencyForKey(i);
            playNote(frequency);
        });
        
        keyboardContainer.appendChild(keyDiv);
    }
}

// Get the frequency for a specific key
function getFrequencyForKey(keyIndex) {
    const baseFrequency = 440; // A4 is 440 Hz
    const octave = Math.floor(keyIndex / 12);
    const noteInOctave = keyIndex % 12;
    const noteRatio = currentScale[noteInOctave];
    return baseFrequency * Math.pow(2, octave) * noteRatio;
}

// Handle scale selection change
document.getElementById('scale-selector').addEventListener('change', (e) => {
    currentScale = scales[e.target.value];
    createKeyboard(); // Rebuild keyboard to reflect new scale
});

createKeyboard();