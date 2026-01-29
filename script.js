const display = document.getElementById('display');
const buttons = document.querySelector('.buttons');

function appendValue(v){
  if(display.value === 'Error') display.value='';
  display.value += v;
}

function clearDisplay(){ display.value = ''; }
function backspace(){ display.value = display.value.slice(0,-1); }

function safeEvaluate(expr){
  // allow only digits, operators, parentheses, decimal point, whitespace and percent
  if(!/^[0-9+-*/().%\s]+$/.test(expr)) return 'Error';
  try{
    // handle percent: replace occurrences of number% with (number/100)
    const transformed = expr.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
    // Use Function constructor (safer than eval in this context after validation)
    // eslint-disable-next-line no-new-func
    const result = Function('return (' + transformed + ')')();
    if(result === Infinity || result === -Infinity || Number.isNaN(result)) return 'Error';
    return String(result);
  }catch(e){
    return 'Error';
  }
}

buttons.addEventListener('click', (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const val = btn.dataset.value;
  const action = btn.dataset.action;
  if(action === 'clear') return clearDisplay();
  if(action === 'back') return backspace();
  if(action === 'equals'){
    display.value = safeEvaluate(display.value);
    return;
  }
  if(val) appendValue(val);
});

// Keyboard support
window.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){
    e.preventDefault();
    display.value = safeEvaluate(display.value);
    return;
  }
  if(e.key === 'Backspace') return backspace();
  if(e.key === 'Escape') return clearDisplay();
  // allow digits and operators
  if(/^[0-9+-*/().%]$/.test(e.key)){
    appendValue(e.key);
  }
});

// Initialize
clearDisplay();