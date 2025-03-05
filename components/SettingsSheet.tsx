import { View, Text } from "react-native";
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
import i18n from "@/locales/i18n";
import ColorSchemeToggle from "@/components/ColorSchemeToggle";

export default function SettingsSheet({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}) {
  // Screen dimesions
  const { insets, height } = useScreenDimensions();

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
    });

  // Top offset value when sheet is open
  const topOffsetMin = insets.top;

  // Animated container style for background overlay
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(isVisible ? "#00000030" : "transparent"),
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
      transform: [
        { translateY: withTiming(isVisible ? topOffsetMin : height) },
      ],
      zIndex: 11,
      height: height * 0.7 - swipeY.value,
    };
  });

  // Drag handle indicator
  const dragHandleIndicator = () => {
    return (
      <View className="w-[40px] h-[8px] rounded-full bg-neutral-200 dark:bg-neutral-700"></View>
    );
  };

  return (
    <GestureDetector gesture={pan}>
      {/* Background overlay */}
      <Animated.View style={[animatedContainerStyle]}>
        {/* Sheet */}
        <Animated.View
          className="bg-white dark:bg-neutral-800 w-full rounded-t-[52px] px-[20px] pt-[12px] flex items-center flex-col"
          style={[animatedSheetStyle]}
        >
          {/* Drag handle */}
          {dragHandleIndicator()}
          {/* Sheet Title */}
          <Text className="w-full text-text text-left text-3xl font-semibold mt-[10px]">
            {i18n.t("settings")}
          </Text>
          {/* Color theme toggle */}
          <ColorSchemeToggle />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}
