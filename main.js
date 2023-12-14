import './styles/resume.scss'
import { extractLocale, getLangFromLocale } from './javascript/i18n.js'
import { langs } from './javascript/langs'
import { getYears } from './javascript/dates.js'

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

  function updateElements() {
    const elements = document.getElementsByClassName("i18nelement");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const k = element.getAttribute("data-i18n");
      const options = element.getAttribute("data-i18n-options");
      const keys = JSON.parse(options);
      let value = i18next.t(k);

      for (var key in keys) {
        value = value.replace (`__${key}__`, keys[key]);
      }

      element.innerHTML = value;
    }
  }

  function updateAttributes() {
    const elements = document.getElementsByClassName("i18nattribute");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const data = element.getAttribute("data-i18n");
      const options = element.getAttribute("data-i18n-options");
      const optKeys = JSON.parse(options);
      const [attrName, k] = data.split(':');
      let attrValue = i18next.t(k);

      for (var optKey in optKeys) {
        value = value.replace (`__${optKey}__`, optKeys[optKey]);
      }

      element.setAttribute(attrName, attrValue);
    }
  }

  function updateContent() {
    updateElements();
    updateAttributes();
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

function updateAge(birthdate) {
  document.getElementById("ageNum").innerHTML = getYears(birthdate);
}

function updateXP(birthdate) {
  document.getElementById("xpNum").innerHTML = getYears(birthdate);
}

function updateDownloadPath(lang) {
  document.getElementById("download").href = `files/resume-baptiste-meurant-${lang}.pdf`;
}

function updateEmail() {
  document.getElementById("email").href = "mailto:baptiste.meurant@gmail.com";
}

function showResponsiveMenu() {
  var menu = document.getElementById("menu");
  var icon = document.getElementById("hamburger-menu");
  var root = document.getElementById("header");
  if (menu.className === "") {
      menu.className = "open";
      icon.className = "open";
      root.style.overflowY = "hidden";
  } else {
      menu.className = "";                    
      icon.className = "";
      root.style.overflowY = "";
  }
}

let lang=getLangFromLocale(locale);

i18Loader(lang);
updateAge("01/17/1980");
updateXP("10/01/2005");
updateDownloadPath(lang);
updateEmail();