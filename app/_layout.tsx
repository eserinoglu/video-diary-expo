import { Stack } from "expo-router";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text } from "react-native";
import { loadSavedLanguage } from "@/locales/i18n";
("@/locales/i18n");
import { useEffect } from "react";

(Text as any).defaultProps = {
  allowFontScaling: false,
};


export default function RootLayout() {
  useEffect(() => {
    const loadLang = async () => {
      await loadSavedLanguage();
    };
    loadLang();
  }, []);

  return (
    <GestureHandlerRootView className="flex-1">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </GestureHandlerRootView>
  );
}
