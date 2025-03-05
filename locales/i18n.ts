import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import tr from "./tr.json";
import { getLocales } from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

const deviceLanguage = getLocales()[0].languageCode ?? "en";

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");
  if (!savedLanguage) {
    savedLanguage = deviceLanguage;
    await AsyncStorage.setItem("language", savedLanguage);
  }

  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      tr: { translation: tr },
    },
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
