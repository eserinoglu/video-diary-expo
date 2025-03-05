import { Stack } from "expo-router";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "@/locales/i18n"
import { Text } from "react-native";

export default function RootLayout() {
  (Text as any).defaultProps = {
    allowFontScaling: false,
  }
  return (
    <GestureHandlerRootView className="flex-1">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </GestureHandlerRootView>
  );
}
