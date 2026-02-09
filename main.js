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
        --comp-bg: #ffffff;
        --comp-border: #e5e8eb;
        --comp-text: #333d4b;
        --comp-sub-text: #6b7684;
        --comp-accent: #3182f6;
        --comp-shadow: rgba(0, 0, 0, 0.06);
      }
      :host([data-theme="dark"]) {
        --comp-bg: #25282d;
        --comp-border: #333;
        --comp-text: #f0f0f0;
        --comp-shadow: rgba(0, 0, 0, 0.3);
      }
      .wrapper {
        padding: 48px 40px; /* Increased padding */
        border: 1px solid var(--comp-border);
        border-radius: 28px; /* Matching border-radius */
        text-align: center;
        box-shadow: 0 12px 40px var(--comp-shadow), 0 4px 12px rgba(0, 0, 0, 0.02);
        background: var(--comp-bg);
        min-height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: all 0.3s ease;
        box-sizing: border-box;
        margin-bottom: 60px; /* Outer margin for the component itself */
      }
      @media (max-width: 600px) {
        .wrapper {
          padding: 30px 24px;
          min-height: 320px;
        }
        h1 {
          font-size: 22px;
        }
        .menu-display {
          font-size: 20px;
          padding: 1.5rem;
        }
      }
      h1 {
        color: var(--comp-text);
        font-size: 28px;
        margin: 0 0 1.5rem 0;
        font-weight: 700;
        letter-spacing: -0.6px;
      }
      button {
        background: var(--comp-accent);
        color: white;
        border: none;
        padding: 14px 28px;
        font-size: 16px;
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(49, 130, 246, 0.25);
        width: 100%; /* Full width for consistency */
      }
      button:hover {
        transform: translateY(-1px);
        background: #1b64da;
        box-shadow: 0 8px 20px rgba(49, 130, 246, 0.3);
      } 
      .menu-display {
        color: var(--comp-text);
        font-size: 24px;
        font-weight: 700;
        margin: 1.5rem 0;
        padding: 2.5rem 1.5rem;
        border-radius: 20px;
        background: #fafbfd;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 140px;
        border: 1px solid var(--comp-border);
      }
      :host([data-theme="dark"]) .menu-display {
        background: #2d3036;
      }
      .menu-display img {
        max-width: 100%;
        height: auto;
        border-radius: 1rem;
        box-shadow: 0 10px 20px var(--comp-shadow);
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
const animalTestNavButton = document.getElementById('animal-test-nav-button');
const body = document.body;

let currentLang = 'ko'; // Default language

function setLanguage(lang) {
    currentLang = lang;
    document.title = translations[lang].pageTitle;
    document.documentElement.lang = lang;
    langToggle.textContent = translations[lang].langButtonText;
    
    // Update navigation button text if needed
    if (animalTestNavButton) {
        animalTestNavButton.textContent = lang === 'ko' ? '동물상 테스트' : 'Animal Face Test';
    }

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

const homeView = document.getElementById('home-view');
const animalFaceTestService = document.getElementById('animal-face-test-service');
const backToHomeButton = document.getElementById('back-to-home-button');

if (animalTestNavButton) {
    animalTestNavButton.addEventListener('click', () => {
        if (homeView && animalFaceTestService) {
            homeView.style.display = 'none';
            animalFaceTestService.style.display = 'flex';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

if (backToHomeButton) {
    backToHomeButton.addEventListener('click', () => {
        if (homeView && animalFaceTestService) {
            homeView.style.display = 'flex';
            animalFaceTestService.style.display = 'none';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

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

    // Share Button Logic
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.currentTarget;
            const currentUrl = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            if (button.classList.contains('twitter')) {
                window.open(`https://twitter.com/intent/tweet?text=${title}&url=${currentUrl}`, '_blank');
            } else if (button.classList.contains('facebook')) {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank');
            } else if (button.classList.contains('copy-link')) {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    alert('링크가 복사되었습니다!');
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            }
        });
    });
});