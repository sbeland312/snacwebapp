
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
const blurb = document.querySelector('.collection-blurb');

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
    subjects: "Subjects in English",
    blurb: "This pilot collection presents a small sample of Latin American archival records within the SNAC Cooperative. SNAC is a collaborative project focused on improving access to historical materials through shared, community-informed archival description. Rather than treating records as isolated objects, SNAC emphasizes relationships between people, organizations, and the histories they are part of. This test environment supports ongoing work toward more inclusive description, including the development of a Spanish-speaking editorial subgroup."
  },
  es: {
    welcomeMsg: "Explorar la colección",
    searchBtn: "Buscar",
    refreshBtn: "Recargar",
    resourceTitle: "Título del recurso",
    languages: "Idiomas",
    countries: "Países",
    scope: "Alcance y Contenido",
    subjects: "Materias en Español",
    blurb: "Esta colección piloto presenta una pequeña muestra de registros archivísticos latinoamericanos dentro de la Cooperativa SNAC. SNAC es un proyecto colaborativo enfocado en mejorar el acceso a materiales históricos mediante descripciones archivísticas compartidas e informadas por la comunidad. En lugar de tratar los registros como objetos aislados, SNAC enfatiza las relaciones entre personas, organizaciones y las historias de las que forman parte. Este entorno de prueba apoya el trabajo continuo hacia descripciones más inclusivas, incluyendo el desarrollo de un subgrupo editorial de habla hispana."
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

  if (blurb) {
    blurb.textContent = translations[language].blurb;
  }

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
