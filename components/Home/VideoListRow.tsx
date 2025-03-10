import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { VideoDiary } from "@/types/VideoDiary";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { useColorTheme } from "@/utils/useColorTheme";
import { useRouter } from "expo-router";
import * as VideoThumbnail from "expo-video-thumbnails";
import { useVideoDatabase } from "@/stores/useVideoDatabase";

export default function VideoListRow({ video }: { video: VideoDiary }) {
  const isDarkMode = useColorTheme().colorScheme === "dark";

  const { setDisplayedVideo } = useVideoDatabase();

  const router = useRouter();
  const navigateToDetail = () => {
    setDisplayedVideo(video);
    router.push("/video-detail");
  };

  const [thumbnail, setThumbnail] = React.useState<string | null>(null);
  const generateThumbnail = async () => {
    const { uri } = await VideoThumbnail.getThumbnailAsync(video.videoUri, {
      time: 10,
    });
    setThumbnail(uri);
  };

  useEffect(() => {
    const loadThumbnail = async () => {
      await generateThumbnail();
    };
    loadThumbnail();
  }, []);

  return (
    <TouchableOpacity onPress={navigateToDetail}>
      <View className="w-full p-2 rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex flex-row items-center gap-3">
        <Image
          source={thumbnail}
          contentFit="cover"
          style={{ width: 70, height: 70, borderRadius: 12 }}
        />
        <View className="flex flex-col items-start flex-1">
          <Text className="text-xl font-semibold text-text">{video.title}</Text>
          <Text
            numberOfLines={2}
            className="text-text text-sm opacity-40 leading-5"
          >
            {video.description}
          </Text>
        </View>
        <Feather
          name="chevron-right"
          size={24}
          color={isDarkMode ? "white" : "black"}
          style={{ opacity: 0.4 }}
        />
      </View>
    </TouchableOpacity>
  );
}
