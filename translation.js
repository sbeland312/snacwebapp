
document.addEventListener("DOMContentLoaded", () => {

// ==========================
// API ENDPOINT + DOM
// ==========================
const googleSheet = 'https://script.google.com/macros/s/AKfycbwgBOHLkyG2yw4IIgaVvhXx703rzhU9lM5jca4PAqB3eSxmA67KeCxA4RY-jtAKqrVd/exec';

const display = document.getElementById('display');
const input = document.getElementById('input');
const welcomeMsg = document.getElementById('welcome-msg');
const searchBtn = document.getElementById('search-btn');
const refreshBtn = document.getElementById('refresh-btn');

// ==========================
// UI TRANSLATIONS
// ==========================
const translations = {
  en: {
    welcomeMsg: "Explore the collection",
    searchBtn: "Search",
    refreshBtn: "Refresh",
    resourceTitle: "Resource Title",
    languages: "Languages",
    countries: "Countries",
    scope: "Scope and Contents",
    subjects: "Subjects in English"
  },
  es: {
    welcomeMsg: "Explorar la colección",
    searchBtn: "Buscar",
    refreshBtn: "Recargar",
    resourceTitle: "Título del recurso",
    languages: "Idiomas",
    countries: "Países",
    scope: "Alcance y Contenido",
    subjects: "Materias en Español"
  }
};

// ==========================
// STATE
// ==========================
let apiData = [];
let currentLanguage = 'en';

// ==========================
// LANGUAGE SWITCHER
// ==========================
const langSwitcher = document.querySelector('.translation');

if (langSwitcher) {
  langSwitcher.addEventListener('click', (event) => {
    const lang = event.target.getAttribute('data-lang');
    if (!lang) return;

    event.preventDefault();
    translatePage(lang);
  });
}

// ==========================
// TRANSLATION
// ==========================
function translatePage(language) {
  currentLanguage = language;

  welcomeMsg.textContent = translations[language].welcomeMsg;
  searchBtn.textContent = translations[language].searchBtn;
  refreshBtn.textContent = translations[language].refreshBtn;

  displayData(apiData);
}

// initial render
translatePage(currentLanguage);

// ==========================
// FETCH DATA
// ==========================
async function getData() {
  try {
    const res = await fetch(googleSheet);
    apiData = await res.json();

    console.log("DATA LOADED:", apiData);

    displayData(apiData);

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

getData();

// ==========================
// SEARCH
// ==========================
function runSearch() {
  filterData(input.value.trim());
}

searchBtn.addEventListener('click', runSearch);

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') runSearch();
});

refreshBtn.addEventListener('click', () => {
  input.value = '';
  displayData(apiData);
});

// ==========================
// FILTER
// ==========================
function filterData(query) {
  if (!query) {
    displayData(apiData);
    return;
  }

  const terms = query.toLowerCase().split(/\s+/);

  const filtered = apiData.filter(item =>
    terms.every(term =>
      Object.values(item).some(val =>
        typeof val === 'string' &&
        val.toLowerCase().includes(term)
      )
    )
  );

  displayData(filtered);
}

// ==========================
// 🔥 HELPER (MUST BE HERE)
// ==========================
function formatURL(url = '') {
  url = url.trim();

  if (!url) return '#';

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return 'https://' + url;
}

// ==========================
// DISPLAY
// ==========================
function displayData(data) {

  if (!display) {
    console.error("Missing #display element");
    return;
  }

  display.innerHTML = data.map(obj => `
    <article class="item">

      <div class="item-header">
        <h2>
          <a href="https://snaccooperative.org/view/85524551#holding-repository"
             target="_blank"
             rel="noopener noreferrer">
            ${obj.SNAC_Holding_Repository || ''}
          </a>
        </h2>
      </div>

      <br/>

      <div class="item-description">

        <h3>
          <span class="inline-label">
            ${translations[currentLanguage].resourceTitle}:
          </span>

          <a href="${formatURL(obj.Resource_URL)}"
             target="_blank"
             rel="noopener noreferrer">
            ${obj.Resource_Title || ''}
          </a>
        </h3>

        <p>
          <span class="inline-label">
            ${translations[currentLanguage].scope}:
          </span>
          ${currentLanguage === "es"
            ? obj.Alcance_y_Contenido || ''
            : obj.Scope_and_Contents || ''}
        </p>

        <p>
          <span class="inline-label">
            ${translations[currentLanguage].subjects}:
          </span>
          ${currentLanguage === "es"
            ? obj.Materias_en_Espanol || ''
            : obj.Subjects_in_English || ''}
        </p>

        <p>
          <span class="inline-label">
            ${translations[currentLanguage].languages}:
          </span>
          ${currentLanguage === "es"
            ? obj.Idiomas || ''
            : obj.Languages || ''}
        </p>

        <p>
          <span class="inline-label">
            ${translations[currentLanguage].countries}:
          </span>
          ${currentLanguage === "es"
            ? obj.Paises || ''
            : obj.Countries || ''}
        </p>

      </div>

    </article>
  `).join('');
}

}); // DOM READY END
