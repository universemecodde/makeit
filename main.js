class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');

    const title = document.createElement('h1');
    title.textContent = 'Lotto Number Generator';

    const button = document.createElement('button');
    button.textContent = 'Generate Numbers';

    const numbersDisplay = document.createElement('div');
    numbersDisplay.setAttribute('class', 'numbers');

    const style = document.createElement('style');
    style.textContent = `
      .wrapper {
        padding: 2rem;
        border: 1px solid var(--accent-color);
        border-radius: 1rem;
        text-align: center;
        box-shadow: 0 10px 30px -10px var(--shadow-color);
        background: oklch(98% 0 0 / 50%);
      }
      h1 {
        color: var(--text-color);
        font-size: 2.5rem;
        margin-bottom: 1rem;
      }
      button {
        background-color: var(--button-bg-color);
        color: var(--button-text-color);
        border: none;
        padding: 1rem 2rem;
        font-size: 1.2rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px -5px var(--shadow-color);
      }
      button:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px -5px var(--shadow-color);
      } 
      .numbers {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
      }
      .number-ball {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5rem;
        color: var(--button-text-color);
        font-weight: bold;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(title);
    wrapper.appendChild(button);
    wrapper.appendChild(numbersDisplay);

    button.addEventListener('click', () => {
      this.generateNumbers(numbersDisplay);
    });
  }

  generateNumbers(displayElement) {
    displayElement.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach(number => {
      const ball = document.createElement('div');
      ball.setAttribute('class', 'number-ball');
      ball.style.backgroundColor = this.getBallColor(number);
      ball.textContent = number;
      displayElement.appendChild(ball);
    });
  }

  getBallColor(number) {
    const hue = (number * 360 / 45) % 360;
    return `oklch(60% 0.25 ${hue})`;
  }
}

customElements.define('lotto-generator', LottoGenerator);

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
}

function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Apply saved theme on load, or default to light
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Check for user's system preference if no theme is saved
    setTheme('dark');
} else {
    setTheme('light');
}

themeToggle.addEventListener('click', toggleTheme);