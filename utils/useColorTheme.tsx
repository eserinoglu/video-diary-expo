import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const useColorTheme = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme) {
        setColorScheme(storedTheme as "light" | "dark");
      }
      setIsThemeLoaded(true);
    };

    loadTheme();
  }, []);

  const setTheme = async (theme: "light" | "dark" | "system") => {
    setColorScheme(theme);
    await AsyncStorage.setItem("theme", theme);
  };

  return { setTheme, colorScheme, isThemeLoaded };
};
