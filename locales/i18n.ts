import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

// Language JSON imports
import en from "./en.json";
import tr from "./tr.json";
import es from "./es.json";
import de from "./de.json";

// Desteklenecek diller
const resources: Record<
  string,
  { translation: Record<string, string>; languageName: string, flag?: string }
> = {
  en: { translation: en, languageName: "English", flag: "🇺🇸" },
  tr: { translation: tr, languageName: "Türkçe", flag: "🇹🇷" },
  es: { translation: es, languageName: "Español", flag: "🇪🇸" },
  de: { translation: de, languageName: "Deutsch", flag: "🇩🇪" },
};

// Dil değiştirme ve kaydetme fonksiyonları
export const changeLanguage = async (languageCode: string) => {
  try {
    // Dili değiştir
    await i18n.changeLanguage(languageCode);

    // Seçilen dili AsyncStorage'a kaydet
    await AsyncStorage.setItem("appLanguage", languageCode);
  } catch (error) {
    console.error("Dil değiştirilirken hata oluştu:", error);
  }
};

// Kayıtlı dili yükle
export const loadSavedLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem("appLanguage");

    // Eğer kayıtlı dil varsa onu kullan, yoksa cihaz dilini al
    const language = savedLanguage || Localization.locale.split("-")[0];

    // Desteklenen diller içinde mi kontrol et
    const finalLanguage = Object.keys(resources).includes(language)
      ? language
      : "en";

    await i18n.changeLanguage(finalLanguage);
    return finalLanguage;
  } catch (error) {
    console.error("Kayıtlı dil yüklenirken hata:", error);
    return "en";
  }
};

// Desteklenen dilleri al
export const getSupportedLanguages = () => {
  return Object.keys(resources).map((lang) => ({
    code: lang,
    name: resources[lang].languageName,
    flag : resources[lang].flag
  }));
};

export const currentLanguage = () => {
  const currentLang = i18n.language;
  return resources[currentLang].languageName;
}

// i18n yapılandırması
i18n.use(initReactI18next).init({
  resources,
  lng: Localization.locale.split("-")[0], // Varsayılan dil
  fallbackLng: "en", // Yedek dil
  interpolation: {
    escapeValue: false, // React zaten kaçırıyor
  },
});

export default i18n;
