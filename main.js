import './style.css'
import { extractLocale, getLangFromLocale } from './javascript/i18n.js'
import { langs } from './javascript/langs'

const { urlWithoutLocale, locale } = extractLocale(document.location.pathname);

async function i18Loader(lang) {
  const jsons = await Promise.all(
    langs.map((l) => fetch("/translations/" + l + ".json").then((r) => r.json()))
  );
  const res = langs.reduce((acc, l, idx) => {
    acc[l] = { translation: jsons[idx] };
    return acc;
  }, {});
  await i18next.init({
    lng: lang,
    debug: false,
    resources: res
  });

  updateContent();
  updateUrl(lang);
  
  i18next.on("languageChanged", () => {
    updateContent();
  });

  function updateContent() {
    const elements = document.getElementsByClassName("i18nelement");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const k = element.getAttribute("data-i18n");
      element.innerHTML = i18next.t(k);
    }
  }

  function updateUrl(lang) {
    window.history.pushState({}, "", `/${lang}`);
  }

  const langSelectors = document.querySelectorAll('.langSelector');

  langSelectors.forEach(langSelector => {
    langSelector.addEventListener('click', (e) => {
      let lang = e.target.name;
      i18next.changeLanguage(lang);
      updateUrl(lang);
    });
  });
}

i18Loader(getLangFromLocale(locale));