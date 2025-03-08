import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { VideoDiary } from "@/types/VideoDiary";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { useColorTheme } from "@/utils/useColorTheme";
import { Link } from "expo-router";
import * as VideoThumbnail from "expo-video-thumbnails";

export default function VideoListRow({ video }: { video: VideoDiary }) {
  const isDarkMode = useColorTheme().colorScheme === "dark";

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
    <Link
      href={{
        pathname: "/video-detail",
        params: {
          id: video.id,
          title: video.title,
          description: video.description,
          uri: video.videoUri,
          width: video.width,
          height: video.height,
          createdAt : video.createdAt
        },
      }}
    >
      <View className="w-full p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex flex-row items-center gap-3">
        <Image
          source={thumbnail}
          style={{ width: 70, height: 65, borderRadius: 12 }}
        />
        <View className="flex flex-col gap-1 items-start flex-1">
          <Text className="text-xl font-semibold text-text">{video.title}</Text>
          <Text numberOfLines={2} className="text-text text-sm opacity-50">
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
    </Link>
  );
}
