import { useScreenDimensions } from "@/utils/useScreenDimensions";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import SettingsSheet from "@/components/SettingsSheet";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import i18n from "@/locales/i18n";
import { useColorTheme } from "@/utils/useColorTheme";

export default function Index() {
  // Screen dimensions and color theme
  const isDarkMode = useColorScheme().colorScheme === "dark";
  const { insets, horizontalPadding } = useScreenDimensions();
  const topPadding = insets.top + 20;
  const {croppedVideos} = useVideoStore()

  // Settings sheet open/close state
  const [isSettingsSheetVisible, setIsSettingsSheetVisible] = useState(false);
  const openSettingsSheet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSettingsSheetVisible(true);
  };

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
        <View className="flex flex-col gap-4 mt-10">
          {croppedVideos.map((video, index) => (
            <Text key={index} >{video}</Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useVideoStore } from "@/stores/useVideoStore";

function UploadVideoButton() {
  const router = useRouter();
  const isDarkMode = useColorTheme().colorScheme === "dark";

  const { setVideo, setIsUploading } = useVideoStore();

  const uploadVideo = async () => {
    setIsUploading(true);
    router.push("/video-edit");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) {
      setVideo(null);
      router.back();
      setIsUploading(false);
      return;
    }

    if (!result.canceled) {
      setVideo(result.assets[0]);
    }
    setIsUploading(false);
  };

  return (
    <TouchableOpacity
      onPress={uploadVideo}
      className="w-full rounded-3xl border border-neutral-200 dark:border-neutral-800 flex flex-row items-center gap-3 justify-start bg-neutral-100 dark:bg-neutral-900 p-6 mt-6"
    >
      <View className="-rotate-12">
        <FontAwesome6
          name="photo-film"
          size={36}
          color={isDarkMode ? "white" : "black"}
        />
      </View>
      <View className="flex flex-col items-start gap-1">
        <Text className="text-2xl font-semibold text-text">New Diary</Text>
        <Text className="text-text opacity-50">{i18n.t("new_diary_desc")}</Text>
      </View>
    </TouchableOpacity>
  );
}
