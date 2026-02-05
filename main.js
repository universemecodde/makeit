class MenuRecommender extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');

    const title = document.createElement('h1');
    title.textContent = '저녁 메뉴 추천';

    const button = document.createElement('button');
    button.textContent = '메뉴 추천받기';

    const menuDisplay = document.createElement('div');
    menuDisplay.setAttribute('class', 'menu-display');
    menuDisplay.textContent = '버튼을 눌러주세요!';

    const style = document.createElement('style');
    style.textContent = `
      :host {
        --component-main-bg-color: oklch(99% 0 0 / 70%);
        --component-text-color: oklch(20% 0.25 260); /* Direct value for light mode */
        --component-button-text-color: oklch(98% 0 0); /* Direct value for light mode */
        --component-shadow-color: oklch(0 0 0 / 0.05);
        --component-button-bg-color: oklch(65% 0.25 260); /* Direct value for light mode */
      }
      :host([data-theme="dark"]) {
        --component-main-bg-color: oklch(15% 0 0 / 40%);
        --component-text-color: oklch(95% 0.25 260); /* Direct value for dark mode */
        --component-button-text-color: oklch(10% 0 0); /* Direct value for dark mode */
        --component-shadow-color: oklch(0 0 0 / 0.07);
        --component-button-bg-color: oklch(65% 0.25 260); /* Direct value for dark mode */
      }
      .wrapper {
        padding: 2rem;
        border: 1px solid oklch(0 0 0 / 0.1);
        border-radius: 1rem;
        text-align: center;
        box-shadow: 0 4px 15px var(--component-shadow-color), 0 15px 35px var(--component-shadow-color);
        background: var(--component-main-bg-color);
        backdrop-filter: blur(10px);
        min-height: 300px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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
      .menu-display {
        color: var(--component-text-color);
        font-size: 2rem;
        font-weight: 600;
        margin-top: 2rem;
        padding: 1.5rem;
        border-radius: 0.5rem;
        background: oklch(0 0 0 / 0.05);
        animation: appear 0.5s ease-out forwards;
      }
      @keyframes appear {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(title);
    wrapper.appendChild(menuDisplay);
    wrapper.appendChild(button);

    button.addEventListener('click', () => {
      this.recommendMenu(menuDisplay);
    });
  }

  recommendMenu(displayElement) {
    const menus = [
      '치킨', '피자', '삼겹살', '떡볶이', '김치찌개',
      '파스타', '초밥', '햄버거', '부대찌개', '된장찌개',
      '짜장면', '짬뽕', '스테이크', '곱창', '보쌈'
    ];
    const randomIndex = Math.floor(Math.random() * menus.length);
    const selectedMenu = menus[randomIndex];
    
    // Animate out
    displayElement.style.animation = 'none';
    void displayElement.offsetWidth; // Trigger reflow
    displayElement.style.animation = 'appear 0.5s ease-out forwards';
    
    displayElement.textContent = `오늘 저녁은 ${selectedMenu}!`;
  }
}

customElements.define('menu-recommender', MenuRecommender);

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // Ensure the query targets the new element, handle case where it might not exist yet
    const recommender = document.querySelector('menu-recommender');
    if (recommender) {
      recommender.setAttribute('data-theme', theme);
    }
}

function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme on load, or default to light
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
});