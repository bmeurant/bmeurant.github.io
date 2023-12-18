export {extractLocale, getLangFromLocale}

import { langs, langDefault } from './langs'

function extractLocale(location) {
  const localeArg = location.search.split("lang=") || langDefault;
  let locale = localeArg[1] || langDefault;
  locale = locale.split("-")[0];

  return locale;
}

function getLangFromLocale(locale) {
  let lang = locale.split('-')[0].toLowerCase();
  return langs.indexOf(lang) >= 0 ? lang : langDefault;
}
