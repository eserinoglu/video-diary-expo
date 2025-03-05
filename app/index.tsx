import { useScreenDimensions } from "@/utils/useScreenDimensions";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import SettingsSheet from "@/components/SettingsSheet";
import { useState } from "react";
import * as Haptics from "expo-haptics"

export default function Index() {
  // Screen dimensions and color theme
  const isDarkMode = useColorScheme().colorScheme === "dark";
  const { insets, horizontalPadding } = useScreenDimensions();
  const topPadding = insets.top + 20;

  // Settings sheet open/close state
  const [isSettingsSheetVisible, setIsSettingsSheetVisible] = useState(false);
  const openSettingsSheet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setIsSettingsSheetVisible(true)
  }

  return (
    <View className="flex-1">
      {/* Settings Sheet */}
      <SettingsSheet
        isVisible={isSettingsSheetVisible}
        setIsVisible={setIsSettingsSheetVisible}
      />
      <ScrollView
        contentContainerStyle={{
          paddingTop: topPadding,
          paddingHorizontal: horizontalPadding,
        }}
        className="bg-background"
      >
        {/* Header */}
        <View className="flex flex-row w-full items-center justify-between">
          <Text className="text-4xl font-bold text-text">Video Diary</Text>
          <TouchableOpacity
            onPress={openSettingsSheet}
            className="bg-neutral-200 p-2 rounded-full dark:bg-neutral-800"
          >
            <Feather
              style={{ opacity: 0.6 }}
              name="settings"
              size={22}
              color={isDarkMode ? "white" : "black"}
            />
          </TouchableOpacity>
        </View>
        {/* Upload video button */}
        <UploadVideoButton />
        {/* History list */}
        <HistoryList />
      </ScrollView>
    </View>
  );
}

function UploadVideoButton() {
  return (
    <TouchableOpacity className="w-full rounded-3xl flex flex-row items-center gap-3 justify-center bg-tint p-4 mt-6">
      <Feather name="upload" size={32} color={"white"} />
      <Text className="text-2xl font-semibold tracking-tight text-white">
        Upload video
      </Text>
    </TouchableOpacity>
  );
}

function HistoryList() {
  return (
    <View className="flex flex-col items-start gap-6">
      <View className="flex flex-row items-center gap-1">
        <Text>Your previous diaries</Text>
      </View>
    </View>
  );
}
