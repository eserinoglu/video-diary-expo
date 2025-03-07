import { Stack } from "expo-router";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text } from "react-native";
import { loadSavedLanguage } from "@/locales/i18n";
("@/locales/i18n");
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

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

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider className="flex-1">
        <GestureHandlerRootView className="flex-1">
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
