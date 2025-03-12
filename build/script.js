const memorySize = 30000;
let memory = new Uint8Array(memorySize);
let pointer = 0;
let output = '';
let intervalId = null;

const clearMemoryStrip = () => {
    document.getElementById('memory-container').innerHTML = '';
}

const updateMemoryVisualization = () => {
    const container = document.getElementById('memory-container');

    while (container.children.length <= pointer) {
        const cell = document.createElement('div');
        cell.className = 'memory-cell';
        cell.textContent = 0;

        const cellNumber = document.createElement('div');
        cellNumber.className = 'cell-number';
        cellNumber.textContent = container.children.length;


        container.appendChild(cell);
        cell.appendChild(cellNumber);
        console.log("Number appended")
    }

    for (let i = 0; i < container.children.length; i++) {
        const cell = container.children[i];
        cell.textContent = memory[i] || 0; 
        cell.classList.toggle('active', i === pointer); 
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
    document.getElementById('output').textContent = '';
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

    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(executeStep, speed);
};

document.getElementById('run').addEventListener('click', () => {
    const code = document.getElementById('code').value;
    const speed = parseInt(document.getElementById('speed').value, 10);
    clearMemoryStrip();
    runBrainfuck(code, speed);
});

document.getElementById('speed').addEventListener('input', (e) => {
    const speed = parseInt(e.target.value, 10);
    document.getElementById('speed-value').textContent = speed;

    if (intervalId) {
        const code = document.getElementById('code').value;
        clearMemoryStrip();
        runBrainfuck(code, speed);
    }
});