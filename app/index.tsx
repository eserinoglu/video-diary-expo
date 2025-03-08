import { useScreenDimensions } from "@/utils/useScreenDimensions";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Entypo, Feather, FontAwesome6, Octicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import SettingsSheet from "@/components/Home/SettingsSheet";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import i18n from "@/locales/i18n";
import { useColorTheme } from "@/utils/useColorTheme";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useVideoTrimStore } from "@/stores/useVideoTrimStore";
import VideoListRow from "@/components/Home/VideoListRow";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useVideoDatabase } from "@/stores/useVideoDatabase";

export default function Index() {
  // Screen dimensions and color theme
  const isDarkMode = useColorScheme().colorScheme === "dark";
  const { insets, horizontalPadding } = useScreenDimensions();
  const topPadding = insets.top + 20;

  // Settings sheet open/close state and function
  const [isSettingsSheetVisible, setIsSettingsSheetVisible] = useState(false);
  const openSettingsSheet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSettingsSheetVisible(true);
  };

  // Video database store
  const { allVideos } = useVideoDatabase();

  return (
    <View className="flex-1">
      <LoadingOverlay />
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

        <View className="flex flex-col items-start gap-3 mt-10">
          <View className="flex flex-row items-center gap-2">
            <Octicons name="history" size={16} color={isDarkMode ? "white" : "black"} style={{opacity: 0.5}} />
            <Text className="text-text text-lg opacity-50">
              {i18n.t("generated_clips")}
            </Text>
          </View>
          {allVideos.length > 0 ? (
            allVideos.map((video) => (
              <VideoListRow key={video.id} video={video} />
            ))
          ) : (
            <View className="w-full flex flex-col items-center gap-4 mt-12">
              <View className="p-8 rounded-full bg-black/10 dark:bg-white/10">
                <Entypo
                  name="images"
                  size={64}
                  color={isDarkMode ? "white" : "black"}
                  style={{ opacity: 0.4 }}
                />
              </View>
              <Text className="text-text text-lg font-medium opacity-40">
                {i18n.t("no_saved_videos")}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// Upload new video button
function UploadVideoButton() {
  // Navigation
  const router = useRouter();

  // Color theme
  const isDarkMode = useColorTheme().colorScheme === "dark";

  // Video trim store states and functions
  const { setVideo, setIsUploading } = useVideoTrimStore();
  const uploadVideo = async () => {
    setIsUploading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) {
      setVideo(null);
      setIsUploading(false);
      return;
    }

    if (!result.canceled) {
      setVideo(result.assets[0]);
    }
    setIsUploading(false);
    router.push("/video-edit");
  };

  return (
    <TouchableOpacity
      onPress={uploadVideo}
      className="w-full rounded-3xl flex flex-row items-center gap-3 justify-start bg-tint p-6 mt-6"
    >
      <View className="-rotate-12">
        <FontAwesome6
          name="photo-film"
          size={36}
          color={"white"}
        />
      </View>
      <View className="flex flex-col items-start gap-1 flex-1">
        <Text className="text-2xl font-semibold text-white">{i18n.t("new_diary")}</Text>
        <Text className="text-white opacity-70">{i18n.t("new_diary_desc")}</Text>
      </View>
    </TouchableOpacity>
  );
}

// Loading video overlay
function LoadingOverlay() {
  const { isUploading } = useVideoTrimStore();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isUploading ? 1 : 0, { duration: 200 }),
      pointerEvents: isUploading ? "auto" : "none",
    };
  });

  return (
    <Animated.View
      style={[animatedStyle]}
      className="absolute bg-background top-0 right-0 left-0 bottom-0 flex flex-col items-center justify-center z-40"
    >
      <ActivityIndicator size="large" className="text-text" />
      <Text className="text-text mt-4">{i18n.t("uploading_video")}</Text>
    </Animated.View>
  );
}
