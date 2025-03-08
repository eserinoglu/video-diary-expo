import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useScreenDimensions } from "@/utils/useScreenDimensions";
import { Pressable, Keyboard } from "react-native";

interface BottomSheetProps {
  children: React.ReactNode;
  isVisible: boolean;
  height: number;
  dismiss: () => void;
  dismissDisabled?: boolean;
}

export default function BottomSheet({
  children,
  isVisible,
  height,
  dismiss,
  dismissDisabled = false,
}: BottomSheetProps) {
  const insets = useScreenDimensions().insets;

  // Keyboard listener and height value
  const keyboardHeight = useSharedValue(0);
  useEffect(() => {
    Keyboard.addListener("keyboardWillShow", (e) => {
      keyboardHeight.value = withTiming(e.endCoordinates.height);
    });
    Keyboard.addListener("keyboardWillHide", (e) => {
      keyboardHeight.value = withTiming(0);
    });
    return () => {
      Keyboard.removeAllListeners("keyboardWillShow");
      Keyboard.removeAllListeners("keyboardWillHide");
    };
  }, []);

  // Sheet height
  const sheetHeight = height + insets.bottom;

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isVisible ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)"
      ),
      pointerEvents: isVisible ? "auto" : "none",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 20,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
    };
  });

  const animatedSheetStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(sheetHeight + keyboardHeight.value),
      transform: [{ translateY: withTiming(isVisible ? 0 : sheetHeight) }],
      paddingBottom: insets.bottom,
    };
  });

  return (
    <Animated.View style={[animatedContainerStyle]}>
      <Pressable
        disabled={dismissDisabled}
        onPress={dismiss}
        className="absolute top-0 left-0 right-0 bottom-0 z-10"
      ></Pressable>
      <Animated.View
        className="bg-white dark:bg-neutral-800 px-4 pt-5 w-full rounded-t-[24px] z-20"
        style={[animatedSheetStyle]}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}
