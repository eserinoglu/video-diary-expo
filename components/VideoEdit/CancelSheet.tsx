import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import BottomSheet from "../Shared/BottomSheet";
import i18n from "@/locales/i18n";
import { useVideoTrimStore } from "@/stores/useVideoTrimStore";
import { useRouter } from "expo-router";

export default function CancelSheet({
  isVisible,
  setIsVisible,
}: {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}) {
  const { setVideo } = useVideoTrimStore();
  const router = useRouter();

  const discardChanges = () => {
    setVideo(null);
    setIsVisible(false);
    router.back();
  };
  return (
    <BottomSheet
      height={190}
      isVisible={isVisible}
      dismiss={() => setIsVisible(false)}
    >
      <View className="flex flex-col w-full gap-2 mt-3">
        <Text className="text-3xl font-semibold text-text">
          {i18n.t("cancel")}
        </Text>
        <Text className="text-lg text-text opacity-50">
          {i18n.t("cancel_desc")}
        </Text>
        <View className="w-full flex flex-row items-center gap-2 mt-4">
          <TouchableOpacity
            onPress={discardChanges}
            className="flex-1 h-[45px] rounded-2xl bg-red-500 flex flex-row items-center justify-center"
          >
            <Text className="text-lg font-semibold text-white">
              {i18n.t("discard")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsVisible(false)}
            className="flex-1 h-[45px] rounded-2xl bg-neutral-200 dark:bg-neutral-700 flex flex-row items-center justify-center"
          >
            <Text className="text-lg font-semibold text-text opacity-50">
              {i18n.t("close")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
}
