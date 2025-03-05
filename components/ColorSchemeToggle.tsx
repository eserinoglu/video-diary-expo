import React from "react";
import { useColorTheme } from "@/utils/useColorTheme";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { View, Text, TouchableOpacity } from "react-native";
import i18n from "@/locales/i18n"
import { Feather } from "@expo/vector-icons";

export default function ColorThemeToggle() {
  const themes = [
    { label: "theme_light", value: "light" },
    { label: "theme_dark", value: "dark" },
  ];
  const { setTheme, colorScheme } = useColorTheme();

  const isDarkMode = colorScheme === "dark";

  const toggleSelection = (theme: "light" | "dark") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTheme(theme);
  };

  const animatedToggleStyle = useAnimatedStyle(() => {
    return {
      left: withTiming(isDarkMode ? "52%" : 4),
    };
  });
  const animatedMoonIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(isDarkMode ? 0 : -24) }],
    };
  });
  const animatedSunIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(isDarkMode ? 24 : -24) }],
    };
  });

  return (
    <View className="w-full flex flex-row items-center justify-between mt-6">
      {/* Label and Icon */}
      <View className="flex flex-row items-center gap-2">
        <View className="flex flex-col h-[24px] overflow-hidden gap-0">
          <Animated.View style={[animatedMoonIconStyle]}>
            <Feather
              name={"moon"}
              size={24}
              color={isDarkMode ? "white" : "black"}
            />
          </Animated.View>
          <Animated.View style={[animatedSunIconStyle]}>
            <Feather
              name={"sun"}
              size={24}
              color={isDarkMode ? "white" : "black"}
            />
          </Animated.View>
        </View>
        <Text className="text font-medium text-text text-lg">
          {i18n.t("color_theme")}
        </Text>
      </View>
      {/* Toggle Container */}
      <View className="flex flex-row items-center bg-neutral-100 rounded-3xl p-1 dark:bg-neutral-700 relative">
        {/* Animated active selection background */}
        <Animated.View
          style={[animatedToggleStyle]}
          className="absolute w-1/2 h-full rounded-3xl bg-tint left-0 z-10"
        ></Animated.View>
        {/* Toggle options */}
        {themes.map((theme) => {
          const isSelected = colorScheme === theme.value;
          return (
            <TouchableOpacity
              onPress={() => toggleSelection(theme.value as "light" | "dark")}
              key={theme.label}
              className={`items-center px-4 py-2 rounded-3xl z-20`}
            >
              <Text
                className={`${
                  isSelected ? "text-white" : "text-text opacity-50"
                } font-medium`}
              >
                {i18n.t(theme.label)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
