import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useScreenDimensions } from "@/utils/useScreenDimensions";
import { useVideoPlayer, VideoView } from "expo-video";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import i18n from "@/locales/i18n";
import { useColorTheme } from "@/utils/useColorTheme";
import { format, set } from "date-fns";
import VideoEditSheet from "@/components/VideoDetail/VideoEditSheet";
import { useVideoEdit } from "@/stores/useVideoEdit";
import { VideoDiary } from "@/types/VideoDiary";
import DeleteVideo from "@/components/VideoDetail/DeleteVideoSheet";
import { deleteVideo } from "@/services/databaseService";
import { saveToGallery } from "@/services/videoService";

export default function VideoDetail() {
  const params = useLocalSearchParams();
  const { id, title, description, uri, width, height, createdAt } = params;

  const { setSelectedVideo } = useVideoEdit();
  const handleSelectedVideo = () => {
    const video: VideoDiary = {
      id: id as string,
      title: title as string,
      description: description as string,
      videoUri: uri as string,
      width: Number(width),
      height: Number(height),
      createdAt: createdAt as string,
    };

    setSelectedVideo(video);
  };

  const [isDeleting, setIsDeleting] = React.useState(false);
  const handleDeleteVideo = async () => {
    setIsDeleting(true);
    await deleteVideo(id as string);
    setIsDeleting(false);
    setDeleteSheetVisible(false);
    router.back();
  };

  const [deleteSheetVisible, setDeleteSheetVisible] = React.useState(false);

  const router = useRouter();

  const isDarkMode = useColorTheme().colorScheme === "dark";

  const insets = useScreenDimensions().insets;

  // Video player
  const player = useVideoPlayer(Array.isArray(uri) ? uri[0] : uri);

  return (
    <View
      className="flex-1 bg-background px-4 w-full flex flex-col gap-4"
      style={{ paddingTop: insets.top + 10 }}
    >
      {/* Navigation header */}
      <View className="w-full flex flex-row items-center justify-between">
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
      <View className="w-full rounded-3xl overflow-hidden flex items-center mt-2 justify-center h-[45%]">
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
      <View className="flex flex-col items-start gap-3 mt-2">
        <Text className="text-3xl text-text font-bold">{title}</Text>
        <Text className="text-text text-lg opacity-50">{description}</Text>
        <Text className="text-text opacity-50 bg-neutral-200 dark:bg-neutral-800 rounded-xl px-4 py-2 mt-1">
          {format(new Date(Number(createdAt)), "d MMM y")}
        </Text>
      </View>
      {/* Video actions */}
      <View className="flex flex-row items-center gap-2 w-full absolute bottom-10 left-4 right-4">
        <SaveToGalleryButton videoUri={uri as string} />
        <TouchableOpacity
          onPress={handleSelectedVideo}
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
      {/* sheets */}
      <DeleteVideo
        isVisible={deleteSheetVisible}
        dismiss={() => setDeleteSheetVisible(false)}
        handleDelete={handleDeleteVideo}
        isDeleting={isDeleting}
      />
      <VideoEditSheet />
    </View>
  );
}

function SaveToGalleryButton({ videoUri }: { videoUri: string }) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
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
