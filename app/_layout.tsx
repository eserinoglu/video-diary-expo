import { Stack } from "expo-router";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text } from "react-native";
import { loadSavedLanguage } from "@/locales/i18n";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { initDatabase } from "@/services/databaseService";
import { useVideoDatabase } from "@/stores/useVideoDatabase";
import * as SplashScreen from "expo-splash-screen";

// Disable font scaling
(Text as any).defaultProps = {
  allowFontScaling: false,
};

// Prevent the splash screen from auto hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { getAllVideos } = useVideoDatabase();

  // App state
  const [isAppReady, setIsAppReady] = useState(false);

  // Initialize the app
  const initializeApp = async () => {
    await Promise.all([loadSavedLanguage(), initDatabase(), getAllVideos()]);
  };

  useEffect(() => {
    const init = async () => {
      await initializeApp();
      setIsAppReady(true);
    };

    init();
  }, []);

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return null;
  }

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
