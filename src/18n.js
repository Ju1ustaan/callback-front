import i18next from "i18next";
import I18NextHttpBackend from "i18next-http-backend";
import i18nextBrowserLanguagedetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18next
.use(I18NextHttpBackend)
.use(i18nextBrowserLanguagedetector)
.use(initReactI18next)
.init({
    fallbackLng: 'kg',
    debug: true,
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', 
    },
    detection: {
        order: ['queryString', 'cookie'],
        cache: ['cookie']
    },
    interpolation: {
        escapeValue: false
    }
})

export default i18next