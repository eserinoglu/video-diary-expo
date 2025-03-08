import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useScreenDimensions } from "@/utils/useScreenDimensions";
import { useVideoPlayer, VideoView } from "expo-video";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import i18n from "@/locales/i18n";
import { useColorTheme } from "@/utils/useColorTheme";
import { format } from "date-fns";
import VideoEditSheet from "@/components/VideoDetail/VideoEditSheet";
import { saveToGallery } from "@/services/videoService";
import DeleteVideoSheet from "@/components/VideoDetail/DeleteVideoSheet";
import { useVideoDatabase } from "@/stores/useVideoDatabase";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function VideoDetail() {
  // Video will be displayed and edited
  const { displayedVideo } = useVideoDatabase();

  // Video edit states
  const [isEditSheetVisible, setIsEditSheetVisible] = useState(false);

  // Vide delete states and functions
  const [deleteSheetVisible, setDeleteSheetVisible] = React.useState(false);
  const { deleteVideo } = useVideoDatabase();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const handleDeleteVideo = async () => {
    if (!displayedVideo) return;
    setIsDeleting(true);
    await deleteVideo(displayedVideo.id);
    setIsDeleting(false);
    setDeleteSheetVisible(false);
    router.back();
  };

  // Router
  const router = useRouter();

  // Color theme
  const isDarkMode = useColorTheme().colorScheme === "dark";

  // Safe area insets
  const insets = useScreenDimensions().insets;

  // Video player
  const player = useVideoPlayer(displayedVideo ? displayedVideo.videoUri : "");

  return (
    <View
      className="flex-1 bg-background px-4 w-full flex flex-col gap-4"
      style={{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }}
    >
      {/* Loading overlay */}
      <LoadingOverlay isVisible={displayedVideo === null} />
      {/* Video detail */}
      {displayedVideo && (
        <View className="w-full flex flex-col flex-1">
          {/* Navigation header */}
          <View className="w-full flex flex-row items-center justify-between mb-3">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-[24] aspect-square"
            >
              <Feather
                name="arrow-left"
                size={24}
                color={isDarkMode ? "white" : "black"}
              />
            </TouchableOpacity>
            <Text className="text-xl font-semibold text-text">
              {i18n.t("clip_detail")}
            </Text>
            <TouchableOpacity
              onPress={() => setDeleteSheetVisible(true)}
              className="w-[24] aspect-square"
            >
              <Feather
                name="trash"
                size={20}
                color={isDarkMode ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>
          {/* Video player */}
          <View className="w-full rounded-3xl overflow-hidden flex items-center mt-2 justify-center h-[50%]">
            <BlurView
              intensity={60}
              experimentalBlurMethod="dimezisBlurView"
              tint={isDarkMode ? "dark" : "light"}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                zIndex: 2,
              }}
            />
            <VideoView
              player={player}
              contentFit="cover"
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                right: 0,
              }}
              nativeControls={false}
            />
            <VideoView
              player={player}
              style={{
                width: "100%",
                height: "100%",
                alignSelf: "center",
                zIndex: 3,
              }}
            />
          </View>
          {/* Video metadata */}
          <View className="flex flex-col w-full items-start gap-2 mt-6">
            <Text className="text-3xl text-text font-bold">
              {displayedVideo.title}
            </Text>
            <Text className="text-text text-lg opacity-50">
              {displayedVideo.description}
            </Text>
            <Text className="text-text opacity-50 bg-neutral-200 dark:bg-neutral-800 rounded-xl px-4 py-2 mt-1">
              {format(new Date(Number(displayedVideo.createdAt)), "d MMM y")}
            </Text>
          </View>
          {/* Video actions */}
          <View className="flex flex-row items-center gap-2 mt-auto">
            <SaveToGalleryButton videoUri={displayedVideo.videoUri} />
            <TouchableOpacity
              onPress={() => setIsEditSheetVisible(true)}
              className="w-1/5 bg-neutral-200 dark:bg-neutral-800 rounded-3xl h-[50px] flex flex-row items-center justify-center gap-2"
            >
              <Feather
                name="edit"
                size={20}
                color={isDarkMode ? "white" : "black"}
                style={{ opacity: 0.5 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* sheets */}
      <DeleteVideoSheet
        isVisible={deleteSheetVisible}
        dismiss={() => setDeleteSheetVisible(false)}
        handleDelete={handleDeleteVideo}
        isDeleting={isDeleting}
      />
      <VideoEditSheet
        isVisible={isEditSheetVisible}
        setIsVisible={setIsEditSheetVisible}
      />
    </View>
  );
}

// Save to gallery button
function SaveToGalleryButton({ videoUri }: { videoUri: string }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  
  // Saving function
  const handleSaveToGallery = async () => {
    setIsSaving(true);
    await saveToGallery(videoUri);
    setIsSaving(false);
    setIsSaved(true);
  };
  return (
    <TouchableOpacity
      disabled={isSaving}
      onPress={handleSaveToGallery}
      className="flex-1 bg-tint rounded-3xl h-[50px] flex flex-row items-center justify-center gap-2"
    >
      <Feather name="download" size={20} color={"white"} />
      {isSaving ? (
        <ActivityIndicator className="text-white" />
      ) : isSaved ? (
        <Text className="text-white font-semibold">
          {i18n.t("video_saved")}
        </Text>
      ) : (
        <Text className="text-white font-semibold">
          {i18n.t("save_gallery")}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// Loading video overlay
function LoadingOverlay({ isVisible }: { isVisible: boolean }) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isVisible ? 1 : 0, { duration: 200 }),
      pointerEvents: isVisible ? "auto" : "none",
    };
  });

  return (
    <Animated.View
      style={[animatedStyle]}
      className="absolute bg-background top-0 right-0 left-0 bottom-0 flex flex-col items-center justify-center z-40"
    >
      <ActivityIndicator size="large" className="text-text" />
      <Text className="text-text mt-4">Loading video...</Text>
    </Animated.View>
  );
}
