export {extractLocale, getLangFromLocale}

import { locales, localeDefault } from './locales'
import { langs, langDefault } from './langs'

function extractLocale(pathname) {
  const urlPaths = pathname.split('/');

  let locale;
  let urlWithoutLocale;
  // We remove the URL locale, for example `/de-DE/about` => `/about`
  const firstPath = urlPaths[1];
  if (locales.filter((locale) => locale !== localeDefault).includes(firstPath)) {
      locale = firstPath;
      urlWithoutLocale = '/' + urlPaths.slice(2).join('/');
  } else {
      locale = localeDefault;
      urlWithoutLocale = pathname;
  }

  return { locale, urlWithoutLocale }
}

function getLangFromLocale(locale) {
  let lang = locale.split('-')[0].toLowerCase();
  return langs.indexOf(lang) >= 0 ? lang : langDefault;
}
