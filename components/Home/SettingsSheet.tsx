import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useScreenDimensions } from "@/utils/useScreenDimensions";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ColorSchemeToggle from "@/components/Home/ColorSchemeToggle";
import * as Haptics from "expo-haptics";
import { Entypo, Feather } from "@expo/vector-icons";
import { useColorTheme } from "@/utils/useColorTheme";
import i18n, {
  changeLanguage,
  getSupportedLanguages,
  currentLanguage,
} from "@/locales/i18n";
import { useTranslation } from "react-i18next";

interface SettingsSheetProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

export default function SettingsSheet({
  isVisible,
  setIsVisible,
}: SettingsSheetProps) {
  // Screen dimesions
  const { insets, height } = useScreenDimensions();

  // Sheet dimension values
  const minHeight = 220 + insets.bottom;
  const maxHeight = height;
  const sheetHeight = useSharedValue(minHeight);

  // Language selection view open states
  const [isLanguageSelectOpen, setIsLanguageSelectOpen] = React.useState(false);

  // Swipe gesture states
  const swipeY = useSharedValue(0);
  const pan = Gesture.Pan()
    .onUpdate((event) => {
      swipeY.value = Math.max(-20, event.translationY);
    })
    .onFinalize((event) => {
      if (event.translationY > 100) {
        runOnJS(setIsVisible)(false);
        swipeY.value = withDelay(200, withTiming(0));
        return;
      }
      swipeY.value = withTiming(0);
    })
    .enabled(!isLanguageSelectOpen);

  // Animated container style for background overlay
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(isVisible ? "#00000050" : "transparent"),
      pointerEvents: isVisible ? "auto" : "none",
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      zIndex: 10,
      justifyContent: "flex-end",
    };
  });
  // Animated sheet style for sliding up/down
  const animatedSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withTiming(isVisible ? 0 : minHeight) }],
      zIndex: 11,
      height: sheetHeight.value - swipeY.value,
    };
  });
  // Drag handle indicator
  const dragHandleIndicator = () => {
    return (
      <View className="w-[40px] h-[8px] rounded-full bg-neutral-200 dark:bg-neutral-700"></View>
    );
  };
  // Open/close language selection view
  const openLanguageSelection = () => {
    setIsLanguageSelectOpen(true);
    sheetHeight.value = withTiming(maxHeight);
    swipeY.value = withTiming(0);
  };
  const closeLanguageSelection = () => {
    setIsLanguageSelectOpen(false);
    sheetHeight.value = withTiming(minHeight);
    swipeY.value = withTiming(0);
  };

  return (
    <GestureDetector gesture={pan}>
      {/* Background overlay */}
      <Animated.View style={[animatedContainerStyle]}>
        {/* Sheet */}
        <Animated.View
          className="bg-white dark:bg-neutral-800 w-full rounded-t-[40px] px-[20px] pt-[12px] flex flex-col items-center"
          style={[animatedSheetStyle]}
        >
          {/* Drag handle */}
          {dragHandleIndicator()}
          {/* Settings Screen */}
          <SettingsScreen
            isLanguageSelectOpen={isLanguageSelectOpen}
            present={openLanguageSelection}
          />
          {/* Language select screen */}
          <LanguageSelectionScreen
            dismiss={closeLanguageSelection}
            isLanguageSelectOpen={isLanguageSelectOpen}
          />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

// Settings screen
function SettingsScreen({
  isLanguageSelectOpen,
  present,
}: {
  isLanguageSelectOpen: boolean;
  present: () => void;
}) {
  const { width } = useScreenDimensions();
  // Animated settings screen styling
  const animatedSettingsScreenStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withTiming(isLanguageSelectOpen ? -width : 0) },
      ],
    };
  });
  return (
    <Animated.View style={[animatedSettingsScreenStyle]}>
      {/* Title */}
      <Text className="w-full text-text text-left text-4xl font-semibold mt-4">
        {i18n.t("settings")}
      </Text>
      {/* Sheet Content */}
      <View className="flex flex-col gap-6 mt-8">
        {/* Color theme toggle */}
        <ColorSchemeToggle />
        {/* Language selection */}
        <LanguageSelectButton present={present} />
      </View>
    </Animated.View>
  );
}

// Opens language selection view
function LanguageSelectButton({ present }: { present: () => void }) {
  const isDarkMode = useColorTheme().colorScheme === "dark";
  return (
    <TouchableOpacity
      onPress={present}
      className="w-full flex flex-row items-center justify-between"
    >
      <View className="flex flex-row items-center gap-3">
        <Entypo
          name="language"
          size={24}
          color={isDarkMode ? "white" : "black"}
          style={{ width: 24, height: 24 }}
        />
        <Text className="text-lg font-medium text-text">
          {i18n.t("language")}
        </Text>
      </View>
      <View className="flex flex-row items-center gap-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-3xl">
        <Text className="text-lg font-medium text-text">
          {currentLanguage()}
        </Text>
        <Feather
          name="chevron-right"
          size={17}
          color={isDarkMode ? "white" : "black"}
        />
      </View>
    </TouchableOpacity>
  );
}

// Language selection screen
function LanguageSelectionScreen({
  dismiss,
  isLanguageSelectOpen,
}: {
  dismiss: () => void;
  isLanguageSelectOpen: boolean;
}) {
  // Screen dimesions
  const { insets, width } = useScreenDimensions();
  // Animated language select screen styling
  const animatedLanguageSelectScreenStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withTiming(isLanguageSelectOpen ? 0 : width) }],
      paddingTop: insets.top + 20,
    };
  });

  const languages = getSupportedLanguages();
  const { i18n } = useTranslation();

  const changeLang = async (langCode: string) => {
    Haptics.selectionAsync();
    await changeLanguage(langCode);
    i18n.reloadResources(langCode);
    dismiss();
  };

  return (
    <Animated.View
      className="absolute left-0 right-0 top-0 bottom-0 px-3 bg-white dark:bg-neutral-800"
      style={[animatedLanguageSelectScreenStyle]}
    >
      {/* Navigation header */}
      <TouchableOpacity
        className="w-full flex flex-row items-center justify-start gap-1"
        onPress={dismiss}
      >
        <Feather
          name="chevron-left"
          size={26}
          color={useColorTheme().colorScheme === "dark" ? "white" : "black"}
        />
        <Text className="text-3xl font-semibold text-text">
          {i18n.t("select_language")}
        </Text>
      </TouchableOpacity>
      {/* Language List */}
      <FlatList
        alwaysBounceVertical={false}
        data={languages}
        className="mt-6"
        contentContainerClassName="gap-2"
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => {
          const isSelected = i18n.language === item.code;
          return (
            <TouchableOpacity
              onPress={() => changeLang(item.code)}
              className="w-full bg-neutral-100 dark:bg-neutral-900 p-6 rounded-3xl flex flex-row items-center justify-between"
            >
              <View className="flex flex-row items-center gap-2">
                <Text className="text-xl">{item.flag}</Text>
                <Text className="text-xl font-medium text-text">
                  {item.name}
                </Text>
              </View>
              {isSelected && (
                <Feather name="check-circle" size={24} color="#12A8F9" />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </Animated.View>
  );
}
