const display = document.getElementById('display');
const subDisplay = document.getElementById('subDisplay');
const historyDrawer = document.getElementById('historyDrawer');
const historyList = document.getElementById('historyList');
const themeToggle = document.getElementById('themeToggle');

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playClickSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
}

function appendToDisplay(char) {
    playClickSound();
    display.value += char;
}

function clearDisplay() {
    playClickSound();
    display.value = '';
    subDisplay.textContent = '';
}

function clearLastElement() {
    playClickSound();
    display.value = display.value.slice(0, -1);
}

function calculatorResult() {
    playClickSound();
    const expression = display.value;
    if (!expression) return;

    try {
        const sanitized = expression.replace(/%/g, '/100');
        const result = Function(`'use strict'; return (${sanitized})`)();

        subDisplay.textContent = `${expression} =`;
        display.value = Number.isInteger(result) ? result : parseFloat(result.toFixed(6));
        saveHistory(`${expression} = ${display.value}`);
    } catch {
        display.value = 'Error';
        setTimeout(() => { display.value = ''; }, 1200);
    }
}

function saveHistory(item) {
    const li = document.createElement('li');
    li.textContent = item;
    li.onclick = () => {
        display.value = item.split('=')[1].trim();
        historyDrawer.classList.add('hidden');
    };
    historyList.prepend(li);
}

function clearHistory() {
    historyList.innerHTML = '';
}

document.getElementById('historyToggle').onclick = () => {
    historyDrawer.classList.toggle('hidden');
};

themeToggle.onclick = () => {
    const html = document.documentElement;
    const nextTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', nextTheme);
};

window.addEventListener('keydown', (e) => {
    if (/[0-9+\-*/().]/.test(e.key)) {
        appendToDisplay(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculatorResult();
    } else if (e.key === 'Backspace') {
        clearLastElement();
    } else if (e.key === 'Escape') {
        clearDisplay();
    }
});
