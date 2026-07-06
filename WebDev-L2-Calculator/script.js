 let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;

const resultDisplay = document.getElementById('result');
const expressionDisplay = document.getElementById('expression');
const subResult = document.getElementById('sub-result');

function updateDisplay(value) {
    resultDisplay.textContent = value;
    adjustFontSize(String(value));
}

function adjustFontSize(text) {
    if (text.length > 12) {
        resultDisplay.style.fontSize = '1.8rem';
    } else if (text.length > 8) {
        resultDisplay.style.fontSize = '2.4rem';
    } else {
        resultDisplay.style.fontSize = '3rem';
    }
}

function calculate(a, op, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/':
            if (b === 0) return 'Cannot ÷ 0';
            return a / b;
        case '%': return a % b;
        default: return b;
    }
}

// Number buttons
document.querySelectorAll('.btn.number').forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.dataset.value;

        if (shouldResetScreen) {
            currentInput = '';
            shouldResetScreen = false;
        }

        // Prevent multiple decimals
        if (value === '.' && currentInput.includes('.')) return;

        // Prevent leading multiple zeros
        if (value === '0' && currentInput === '0') return;

        currentInput += value;
        updateDisplay(currentInput);

        if (operator) {
            expressionDisplay.textContent = previousInput + ' ' + getOperatorSymbol(operator) + ' ' + currentInput;
        } else {
            expressionDisplay.textContent = '';
        }
    });
});

// Operator buttons
document.querySelectorAll('.btn.operator').forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.dataset.value;

        if (currentInput === '' && previousInput === '') return;

        // Operator chaining — calculate previous if exists
        if (currentInput !== '' && previousInput !== '' && operator) {
            const result = calculate(previousInput, operator, currentInput);
            if (typeof result === 'string') {
                updateDisplay(result);
                subResult.textContent = 'Division by zero error';
                expressionDisplay.textContent = '';
                currentInput = '';
                previousInput = '';
                operator = null;
                return;
            }
            const rounded = parseFloat(result.toFixed(10));
            previousInput = String(rounded);
            updateDisplay(rounded);
        } else if (currentInput !== '') {
            previousInput = currentInput;
        }

        operator = value;
        currentInput = '';
        subResult.textContent = '';
        expressionDisplay.textContent = previousInput + ' ' + getOperatorSymbol(operator);
    });
});

// Equals button
document.getElementById('equals').addEventListener('click', () => {
    if (operator === null || currentInput === '' || previousInput === '') return;

    const result = calculate(previousInput, operator, currentInput);

    if (typeof result === 'string') {
        // Division by zero
        expressionDisplay.textContent = previousInput + ' ' + getOperatorSymbol(operator) + ' ' + currentInput + ' =';
        updateDisplay(result);
        subResult.textContent = 'Division by zero error';
        currentInput = '';
        previousInput = '';
        operator = null;
        return;
    }

    const rounded = parseFloat(result.toFixed(10));
    expressionDisplay.textContent = previousInput + ' ' + getOperatorSymbol(operator) + ' ' + currentInput + ' =';
    updateDisplay(rounded);
    subResult.textContent = '';
    currentInput = String(rounded);
    previousInput = '';
    operator = null;
    shouldResetScreen = true;
});

// Clear button
document.getElementById('clear').addEventListener('click', () => {
    currentInput = '';
    previousInput = '';
    operator = null;
    shouldResetScreen = false;
    updateDisplay('0');
    expressionDisplay.textContent = '';
    subResult.textContent = '';
    resultDisplay.style.fontSize = '3rem';
});

// Backspace button
document.getElementById('backspace').addEventListener('click', () => {
    if (shouldResetScreen) return;
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || '0');
});

// Helper
function getOperatorSymbol(op) {
    switch (op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        case '%': return '%';
        default: return op;
    }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') document.querySelector(`[data-value="${e.key}"]`)?.click();
    if (e.key === '.') document.querySelector('[data-value="."]')?.click();
    if (e.key === '+') document.querySelector('[data-value="+"]')?.click();
    if (e.key === '-') document.querySelector('[data-value="-"]')?.click();
    if (e.key === '*') document.querySelector('[data-value="*"]')?.click();
    if (e.key === '/') { e.preventDefault(); document.querySelector('[data-value="/"]')?.click(); }
    if (e.key === '%') document.querySelector('[data-value="%"]')?.click();
    if (e.key === 'Enter' || e.key === '=') document.getElementById('equals').click();
    if (e.key === 'Backspace') document.getElementById('backspace').click();
    if (e.key === 'Escape') document.getElementById('clear').click();
});