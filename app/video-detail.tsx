import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useScreenDimensions } from "@/utils/useScreenDimensions";
import { useVideoPlayer, VideoView } from "expo-video";

export default function VideoDetail() {
  const params = useLocalSearchParams();
  const { id, title, description, uri } = params;

  const insets = useScreenDimensions().insets;

  // Video player
  const player = useVideoPlayer(Array.isArray(uri) ? uri[0] : uri);

  // Video player dimension calculation

  return (
    <View
      className="flex-1 bg-background px-4"
      style={{ paddingTop: insets.top }}
    >
      <VideoView
        player={player}
        style={{ width: "100%", height: "55%" }}
      />
      {/* Video title and description */}
      <View className="flex flex-col items-start gap-1 mt-6">
        <Text className="text-3xl text-text font-semibold">{title}</Text>
        <Text className="text-text text-lg opacity-50">{description}</Text>
      </View>
    </View>
  );
}
