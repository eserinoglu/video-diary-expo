import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useEffect } from "react";
import { useVideoStore } from "@/stores/useVideoStore";
import { VideoView, useVideoPlayer } from "expo-video";
import { useScreenDimensions } from "@/utils/useScreenDimensions";
import { Feather } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { FFmpegKit } from "ffmpeg-kit-react-native";
export default function VideoEdit() {
  const { insets } = useScreenDimensions();

  const { video, isUploading } = useVideoStore();

  const [isPlaying, setIsPlaying] = React.useState(false);

  const videoSource = video?.uri;
  const player = useVideoPlayer(videoSource!, (player) => {
    player.loop = true;
  });

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="flex-1 items-center flex-col justify-start px-4"
    >
      {isUploading && <Text className="text-text">Loading</Text>}
      <View
        style={{
          width: 300,
          height: 500,
        }}
      >
        <TouchableOpacity
          className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center z-10"
          onPress={() => {
            if (isPlaying) {
              player.pause();
              setIsPlaying(false);
            } else {
              player.play();
              setIsPlaying(true);
            }
          }}
        >
          <View className="w-20 rounded-full aspect-square flex items-center justify-center bg-neutral-200 dark:bg-neutral-700">
            <Feather
              color={"white"}
              name={isPlaying ? "pause" : "play"}
              size={36}
            />
          </View>
        </TouchableOpacity>
        {video && (
          <View className="w-full h-full flex flex-col items-center">
            <VideoView
              style={{
                width: "100%",
                height: "100%",
              }}
              player={player}
              contentFit="contain"
              allowsFullscreen={false}
              allowsPictureInPicture={false}
              nativeControls={false}
            />
          </View>
        )}
      </View>
      <VideoSlider />
    </View>
  );
}

function VideoSlider() {
  const trimmingDurationOptions = [5, 10];
  const [selectedTrimmingDuration, setSelectedTrimmingDuration] =
    React.useState(trimmingDurationOptions[0]);

  const { video } = useVideoStore();

  const [thumbnails, setThumbnails] = React.useState<string[]>([]);
  async function generateThumbnails() {
    if (!video?.uri) return [];

    const thumbnails: string[] = [];
    const outputDir = FileSystem.cacheDirectory + "thumbs/";

    // Çıkış klasörünü oluştur
    await FileSystem.makeDirectoryAsync(outputDir, {
      intermediates: true,
    }).catch(() => {});

    // 10 farklı frame için thumbnail alalım
    for (let i = 0; i < 10; i++) {
      const time = i * 2; // 2 saniyede bir frame al
      const outputPath = `${outputDir}thumb_${i}.jpg`;

      // FFmpeg komutunu çalıştır
      const command = `-y -i "${video.uri}" -ss ${time} -vframes 1 -q:v 5 -vf "scale=160:-1:flags=lanczos" -pix_fmt yuv420p -color_range 1 "${outputPath}"`;
      await FFmpegKit.execute(command);

      thumbnails.push(outputPath);
    }

    return thumbnails;
  }

  useEffect(() => {
    async function fetchThumbnails() {
      const outputDir = FileSystem.cacheDirectory + "thumbs/";
      if (video?.uri) {
        await FileSystem.deleteAsync(outputDir, { idempotent: true });
        const generatedThumbs = await generateThumbnails();
        if (generatedThumbs) {
          setThumbnails(generatedThumbs);
        }
      }
    }

    fetchThumbnails();
  }, [video]);

  return (
    <View className="flex flex-col gap-4 mt-10 items-start w-full">
      <View className="w-full flex flex-row items-center">
        {trimmingDurationOptions.map((duration) => {
          const isSelected = selectedTrimmingDuration === duration;
          return (
            <TouchableOpacity
              className={`px-5 py-1 rounded-full ${
                isSelected ? "bg-tint" : "bg-transparent"
              }`}
              key={duration}
              onPress={() => setSelectedTrimmingDuration(duration)}
            >
              <Text
                className={`font-medium text-lg ${
                  isSelected ? "text-white" : "text-text"
                }`}
              >
                {duration}s
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <ScrollView
        className="w-full h-[80px]"
        horizontal
        contentContainerClassName="gap-1"
      >
        {thumbnails.map((thumbnail, index) => (
          <Image
            key={index}
            source={{ uri: thumbnail }}
            style={{ width: 45, height: 80 }}
          />
        ))}
      </ScrollView>
    </View>
  );
}
