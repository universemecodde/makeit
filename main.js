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
      /* Component-specific variables */
      :host {
        --component-main-bg-color: oklch(99% 0 0 / 70%);
        --component-text-color: var(--text-color);
        --component-button-text-color: var(--button-text-color);
        --component-shadow-color: oklch(0 0 0 / 0.05);
        --component-button-bg-color: var(--button-bg-color);
      }

      :host([data-theme="dark"]) {
        --component-main-bg-color: oklch(15% 0 0 / 40%);
        --component-text-color: var(--text-color);
        --component-button-text-color: var(--button-text-color);
        --component-shadow-color: oklch(0 0 0 / 0.07);
        --component-button-bg-color: var(--button-bg-color);
      }

      .wrapper {
        padding: 2rem;
        border: 1px solid oklch(0 0 0 / 0.1);
        border-radius: 1rem;
        text-align: center;
        box-shadow: 0 4px 15px var(--component-shadow-color), 0 15px 35px var(--component-shadow-color);
        background: var(--component-main-bg-color);
        backdrop-filter: blur(10px);
      }
      h1 {
        color: var(--component-text-color);
        font-size: 2.5rem;
        margin-bottom: 1rem;
        font-weight: 600;
      }
      button {
        background-color: var(--component-button-bg-color);
        color: var(--component-button-text-color);
        border: none;
        padding: 1rem 2rem;
        font-size: 1.2rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px -5px var(--component-shadow-color);
        font-weight: 600;
      }
      button:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px -5px var(--component-shadow-color);
      } 
      .numbers {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
        perspective: 400px;
      }
      .number-ball {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5rem;
        color: var(--component-button-text-color);
        font-weight: 600;
        animation: appear 0.5s ease-out forwards;
      }

      @keyframes appear {
        from {
          opacity: 0;
          transform: scale(0.5) translateY(-20px) rotateX(45deg);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0) rotateX(0deg);
        }
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

    sortedNumbers.forEach((number, index) => {
      const ball = document.createElement('div');
      ball.setAttribute('class', 'number-ball');
      ball.style.backgroundColor = this.getBallColor(number);
      ball.style.animationDelay = `${index * 0.1}s`;
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
    document.querySelector('lotto-generator').setAttribute('data-theme', theme);
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