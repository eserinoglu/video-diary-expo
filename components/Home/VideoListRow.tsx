import { View, Text } from "react-native";
import React from "react";
import { VideoDiary } from "@/types/VideoDiary";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { useColorTheme } from "@/utils/useColorTheme";
import { Link, useRouter } from "expo-router";

export default function VideoListRow({ video }: { video: VideoDiary }) {
  const isDarkMode = useColorTheme().colorScheme === "dark";
  const router = useRouter();

  return (
    <Link
      href={{
        pathname: "/video-detail",
        params: {
          id: video.id,
          title: video.title,
          description: video.description,
          uri: video.videoUri,
        },
      }}
    >
      <View className="w-full p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex flex-row items-center gap-3">
        <View className="w-[70px] aspect-square rounded-2xl bg-neutral-500"></View>
        <View className="flex flex-col gap-1 items-start flex-1">
          <Text className="text-xl font-semibold text-text">{video.title}</Text>
          <Text numberOfLines={2} className="text-text opacity-50">
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
