const translations = {
  'ko': {
    pageTitle: '저녁 메뉴 추천',
    componentTitle: '저녁 메뉴 추천',
    buttonText: '메뉴 추천받기',
    initialText: '버튼을 눌러주세요!',
    resultText: '오늘 저녁은 ${selectedMenu}!',
    langButtonText: 'EN',
    menus: [
      '치킨', '피자', '삼겹살', '떡볶이', '김치찌개',
      '파스타', '초밥', '햄버거', '부대찌개', '된장찌개',
      '짜장면', '짬뽕', '스테이크', '곱창', '보쌈'
    ],
    images: {
      pizza: 'pizza.jpg' // Simplified filename
    }
  },
  'en': {
    pageTitle: 'Dinner Menu Recommender',
    componentTitle: 'Dinner Menu Recommender',
    buttonText: 'Get Recommendation',
    initialText: 'Press the button!',
    resultText: 'Tonight\'s dinner is ${selectedMenu}!',
    langButtonText: 'KO',
    menus: [
      'Chicken', 'Pizza', 'Pork Belly', 'Tteokbokki', 'Kimchi Stew',
      'Pasta', 'Sushi', 'Hamburger', 'Army Stew', 'Bean Paste Stew',
      'Jajangmyeon', 'Jjamppong', 'Steak', 'Gobchang', 'Bossam'
    ],
    images: {
      pizza: '피자%20이미지%20삭제.jpg' // URL-encoded filename
    }
  }
};

class MenuRecommender extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');

    const title = document.createElement('h1');
    title.setAttribute('id', 'component-title'); // Add ID for easy access

    const button = document.createElement('button');
    button.setAttribute('id', 'component-button'); // Add ID for easy access

    const menuDisplay = document.createElement('div');
    menuDisplay.setAttribute('class', 'menu-display');
    menuDisplay.setAttribute('id', 'menu-display'); // Add ID for easy access

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
        display: flex; /* For centering content vertically if needed */
        align-items: center;
        justify-content: center;
        min-height: 80px; /* Ensure space for image */
      }
      .menu-display img {
        max-width: 100%;
        height: auto;
        display: block;
        border-radius: 0.5rem;
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
      this.recommendMenu(); // No need to pass displayElement, can access via shadowRoot
    });
  }

  // Method to update component's text based on language
  updateText(lang) {
    const titleElement = this.shadowRoot.getElementById('component-title');
    const buttonElement = this.shadowRoot.getElementById('component-button');
    const menuDisplayElement = this.shadowRoot.getElementById('menu-display');

    if (titleElement) titleElement.textContent = translations[lang].componentTitle;
    if (buttonElement) buttonElement.textContent = translations[lang].buttonText;
    
    // Only update initial text if it's currently showing initial or result text (not an image)
    const currentText = menuDisplayElement.textContent;
    if (currentText === translations['ko'].initialText || 
        currentText === translations['en'].initialText ||
        currentText.includes(translations['ko'].resultText.split('${selectedMenu}')[0]) ||
        currentText.includes(translations['en'].resultText.split('${selectedMenu}')[0])) {
      menuDisplayElement.textContent = translations[lang].initialText;
    }
    
    // Store menus and resultText on the instance for easy access
    this.currentMenus = translations[lang].menus;
    this.currentResultTextTemplate = translations[lang].resultText;
    this.currentImages = translations[lang].images;
  }

  recommendMenu() {
    const displayElement = this.shadowRoot.getElementById('menu-display');
    const menus = this.currentMenus; // Use instance's menus
    const resultTextTemplate = this.currentResultTextTemplate; // Use instance's template
    const images = this.currentImages;

    const randomIndex = Math.floor(Math.random() * menus.length);
    const selectedMenu = menus[randomIndex];
    
    displayElement.style.animation = 'none';
    void displayElement.offsetWidth; 
    displayElement.style.animation = 'appear 0.5s ease-out forwards';
    
    if (selectedMenu === '피자' || selectedMenu === 'Pizza') {
      const pizzaImagePath = images.pizza;
      displayElement.innerHTML = `<img src="${pizzaImagePath}" alt="${selectedMenu}">`;
    } else {
      displayElement.textContent = resultTextTemplate.replace('${selectedMenu}', selectedMenu);
    }
  }
}

customElements.define('menu-recommender', MenuRecommender);

const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');
const body = document.body;

let currentLang = 'ko'; // Default language

function setLanguage(lang) {
    currentLang = lang;
    document.title = translations[lang].pageTitle;
    document.documentElement.lang = lang;
    langToggle.textContent = translations[lang].langButtonText;
    localStorage.setItem('lang', lang);

    // Update text content of the menu recommender component
    const recommender = document.querySelector('menu-recommender');
    if (recommender) {
      recommender.updateText(lang); // Call new method on the component
    }
}

function setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
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

function toggleLanguage() {
    const newLang = currentLang === 'ko' ? 'en' : 'ko';
    setLanguage(newLang);
}

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);
langToggle.addEventListener('click', toggleLanguage);

document.addEventListener('DOMContentLoaded', () => {
    // Initial Theme Setup
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    // Initial Language Setup
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
        setLanguage(savedLang);
    } else if (navigator.language.startsWith('en')) {
        setLanguage('en');
    } else {
        setLanguage('ko');
    }
});