const memorySize = 30000;
let memory = new Uint8Array(memorySize);
let pointer = 0;
let output = '';
let intervalId = null;

const updateMemoryVisualization = () => {
    const container = document.getElementById('memory-container');
    container.innerHTML = '';

    for (let i = 0; i <= pointer; i++) {
        const cell = document.createElement('div');
        cell.className = `memory-cell ${i === pointer ? 'active' : ''}`;
        cell.textContent = memory[i];

        const cellNumber = document.createElement('div');
        cellNumber.className = 'cell-number';
        cellNumber.textContent = i;

        cell.appendChild(cellNumber);
        container.appendChild(cell);
    }
};

const highlightCode = (index) => {
    const code = document.getElementById('code').value;
    const codeHighlight = document.getElementById('code-highlight');
    codeHighlight.innerHTML = '';

    for (let i = 0; i < code.length; i++) {
        const span = document.createElement('span');
        span.textContent = code[i];
        if (i === index) {
            span.classList.add('highlight');
        }
        codeHighlight.appendChild(span);
    }
};

const runBrainfuck = (code, speed) => {
    memory = new Uint8Array(memorySize);
    pointer = 0;
    output = '';
    let loopStack = [];
    let i = 0;

    const executeStep = () => {
        if (i >= code.length) {
            clearInterval(intervalId);
            return;
        }

        highlightCode(i);
        const command = code[i];
        switch (command) {
            case '>':
                pointer++;
                if (pointer >= memory.length) {
                    memory = new Uint8Array(memory.length + 1);
                }
                break;
            case '<':
                pointer = Math.max(0, pointer - 1);
                break;
            case '+':
                memory[pointer] = (memory[pointer] + 1) % 256;
                break;
            case '-':
                memory[pointer] = (memory[pointer] - 1 + 256) % 256;
                break;
            case '.':
                output += String.fromCharCode(memory[pointer]);
                document.getElementById('output').textContent = output;
                break;
            case '[':
                if (memory[pointer] === 0) {
                    let depth = 1;
                    while (depth > 0) {
                        i++;
                        if (code[i] === '[') depth++;
                        if (code[i] === ']') depth--;
                    }
                } else {
                    loopStack.push(i);
                }
                break;
            case ']':
                if (memory[pointer] !== 0) {
                    i = loopStack[loopStack.length - 1] - 1;
                } else {
                    loopStack.pop();
                }
                break;
        }
        i++;
        updateMemoryVisualization();
    };

    intervalId = setInterval(executeStep, speed);
};

document.getElementById('run').addEventListener('click', () => {
    const code = document.getElementById('code').value;
    const speed = parseInt(document.getElementById('speed').value, 10);
    if (intervalId) clearInterval(intervalId);
    runBrainfuck(code, speed);
});

document.getElementById('speed').addEventListener('input', (e) => {
    document.getElementById('speed-value').textContent = e.target.value;
});