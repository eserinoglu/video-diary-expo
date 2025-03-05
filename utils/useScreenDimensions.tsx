import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dimensions } from "react-native";

export const useScreenDimensions = () => {
  const insets = useSafeAreaInsets();
  const { width, height } = Dimensions.get("screen");
  return {
    width,
    height,
    insets: {
      top: insets.top,
      bottom: insets.bottom,
      left: insets.left,
      right: insets.right,
    },
    horizontalPadding: 16,
  };
};
