import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useScreenDimensions } from "@/utils/useScreenDimensions";
import { Ionicons } from "@expo/vector-icons";
import i18n from "@/locales/i18n";

export default function DeleteVideo({
  isVisible,
  dismiss,
  handleDelete,
  isDeleting,
}: {
  isVisible: boolean;
  dismiss: () => void;
  handleDelete: () => Promise<void>;
  isDeleting: boolean;

}) {
  const sheetHeight = 255;

  const insets = useScreenDimensions().insets;

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isVisible ? "rgba(0, 0, 0, 0.5)" : "transparent"
      ),
      pointerEvents: isVisible ? "auto" : "none",
    };
  });

  const animatedSheetStyle = useAnimatedStyle(() => {
    return {
      height: sheetHeight,
      transform: [{ translateY: withTiming(isVisible ? 0 : sheetHeight) }],
      paddingBottom: insets.bottom,
    };
  });

  return (
    <Animated.View
      style={[animatedContainerStyle]}
      className="absolute bottom-0 left-0 top-0 right-0 flex-1 z-10 flex flex-col items-center justify-end"
    >
      <Animated.View
        style={[animatedSheetStyle]}
        className="w-full bg-white dark:bg-neutral-800 rounded-t-[24px] flex flex-col gap-4 px-4 pt-6"
      >
        {/* Sheet body */}
        <View className="flex flex-col w-full gap-4">
          <Ionicons name="warning" size={54} color={"#ef4444"} />
          <Text className="text-xl text-text font-medium">
            {i18n.t("delete_video_desc")}
          </Text>
        </View>
        {/* Sheet actions */}
        <View className="flex flex-row w-full gap-2 h-[45px] mt-4">
          {/* Delete button */}
          <TouchableOpacity
            onPress={handleDelete}
            className="bg-red-500 h-full flex items-center justify-center rounded-2xl flex-1"
          >
            {isDeleting ? (
              <ActivityIndicator className="text-white" />
            ) : (
              <Text className="text-white text-lg font-medium">
                {i18n.t("delete")}
              </Text>
            )}
          </TouchableOpacity>
          {/* Cancel button */}
          <TouchableOpacity
            onPress={dismiss}
            className="bg-neutral-200 dark:bg-neutral-700 h-full flex items-center justify-center rounded-2xl flex-1"
          >
            <Text className="text-text opacity-50 text-lg font-medium">
              {i18n.t("cancel")}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}
