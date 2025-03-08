import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import i18n from "@/locales/i18n";
import { useScreenDimensions } from "@/utils/useScreenDimensions";

export default function ResponseScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { status } = params;

  const insets = useScreenDimensions().insets;

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });
  }, []);

  return (
    <View
      style={{ paddingBottom: insets.bottom + 10 }}
      className="flex-1 bg-background flex items-center justify-center"
    >
      {/* Success screen */}
      {status === "success" && (
        <View className="flex flex-col gap-6 items-center w-full px-4 h-full justify-center">
          <View className="flex flex-col w-full gap-6 my-auto">
            <View className="p-5 rounded-full mx-auto bg-green-100 dark:bg-green-900">
              <Feather name="check" size={64} color="#22c55e" />
            </View>
            <Text className="text-text text-3xl text-center font-semibold">
              {i18n.t("crop_success")}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.dismissAll()}
            className="w-full h-[50px] bg-green-500 rounded-3xl flex items-center justify-center"
          >
            <Text className="text-white font-semibold text-xl">
              {i18n.t("navigate_root")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Error screen */}
      {status === "error" && (
        <View className="flex flex-col gap-6 items-center w-full px-4 h-full justify-center">
          <View className="flex flex-col w-full gap-6 my-auto">
            <View className="p-5 rounded-full mx-auto bg-red-100 dark:bg-red-900">
              <Ionicons name="warning" size={64} color="#ef4444" />
            </View>
            <Text className="text-text text-3xl text-center font-semibold">
              {i18n.t("crop_failure")}
            </Text>
          </View>
          <View className="flex flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-1 h-[50px] bg-red-500 rounded-3xl flex items-center justify-center"
            >
              <Text className="text-white font-semibold text-xl">
                {i18n.t("retry")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.dismissAll()}
              className="flex-1 h-[50px] bg-neutral-200 dark:bg-neutral-800 rounded-3xl flex items-center justify-center"
            >
              <Text className="text-text opacity-50 font-semibold text-xl">
                {i18n.t("navigate_root")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
