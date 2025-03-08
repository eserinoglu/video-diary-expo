import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import i18n from "@/locales/i18n";
import BottomSheet from "../Shared/BottomSheet";

export default function DeleteVideoSheet({
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
  return (
    <BottomSheet height={205} isVisible={isVisible} dismiss={dismiss}>
      {/* Sheet body */}
      <View className="flex flex-col w-full gap-4">
        <Ionicons name="warning" size={54} color={"#ef4444"} />
        <Text className="text-xl text-text font-medium">
          {i18n.t("delete_video_desc")}
        </Text>
      </View>
      {/* Sheet actions */}
      <View className="flex flex-row w-full gap-2 flex-1 items-end">
        {/* Delete button */}
        <TouchableOpacity
          onPress={handleDelete}
          className="bg-red-500 h-[45px] flex items-center justify-center rounded-2xl flex-1"
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
          className="bg-neutral-200 dark:bg-neutral-700 h-[45px] flex items-center justify-center rounded-2xl flex-1"
        >
          <Text className="text-text opacity-50 text-lg font-medium">
            {i18n.t("cancel")}
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}
