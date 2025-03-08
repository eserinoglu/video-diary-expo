import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useVideoTrimStore } from "@/stores/useVideoTrimStore";
import { VideoView, useVideoPlayer } from "expo-video";
import { useScreenDimensions } from "@/utils/useScreenDimensions";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import i18n from "@/locales/i18n";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { useColorTheme } from "@/utils/useColorTheme";

export default function VideoEdit() {
  const { video, setVideo } = useVideoTrimStore();
  const { insets, height } = useScreenDimensions();
  const router = useRouter();

  const goBack = () => {
    setVideo(null);
    router.back();
  };

  return (
    <View
      style={{ paddingTop: insets.top, height: height }}
      className="flex-1 bg-background px-4 flex flex-col items-center gap-4"
    >
      {video && (
        <View className="w-full flex flex-col flex-1 gap-6">
          <TouchableOpacity
            onPress={goBack}
            className="w-full flex flex-row items-center justify-start gap-2"
          >
            <Text className="font-medium text-text">{i18n.t("cancel")}</Text>
          </TouchableOpacity>
          <VideoDisplay />
          <TimelineView />
          <ClipDurationSelector />
          <NextButton />
        </View>
      )}
    </View>
  );
}

function VideoDisplay() {
  const {
    video,
    player,
    setPlayer,
    generateThumbnails,
    startTime,
    selectedTrimmingDuration,
  } = useVideoTrimStore();

  const newPlayer = video ? useVideoPlayer(video.uri) : null;

  const [isPlaying, setIsPlaying] = useState(false);

  const isDarkMode = useColorTheme().colorScheme === "dark";

  useEffect(() => {
    if (newPlayer) {
      setPlayer(newPlayer);
      generateThumbnails();
    }
  }, [video, player]);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handlePlayPause = (action: "play" | "pause") => {
    if (!player) return;

    player.addListener("playingChange", (event) => {
      setIsPlaying(event.isPlaying);
    });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (action === "play") {
      player.currentTime = startTime;
      player.play();

      setIsPlaying(true);

      timeoutRef.current = setTimeout(() => {
        setIsPlaying(false);
        player.pause();
      }, selectedTrimmingDuration * 1000);
    } else {
      player.pause();
      setIsPlaying(false);
    }
  };

  return (
    <View className="w-full h-[50%] flex items-center justify-center overflow-hidden rounded-2xl">
      {player && (
        <>
          <TouchableOpacity
            onPress={() => handlePlayPause(isPlaying ? "pause" : "play")}
            className="absolute w-full h-full top-0 right-0 flex items-center justify-center z-10"
          >
            <View className="w-16 aspect-square rounded-full bg-white/60 dark:bg-black/60 flex items-center justify-center">
              <Feather
                name={isPlaying ? "pause" : "play"}
                size={32}
                color="white"
              />
            </View>
          </TouchableOpacity>
          <VideoView
            player={player}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              right: 0,
            }}
            nativeControls={false}
            contentFit="cover"
          />
          <BlurView
            intensity={60}
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
            style={{ width: "100%", height: "100%", zIndex: 3 }}
            nativeControls={false}
          />
        </>
      )}
    </View>
  );
}

function TimelineView() {
  // Get the necessary values from the store
  const {
    thumbnails,
    pixelForEachSecond,
    videoDuration,
    selectedTrimmingDuration,
    player,
    setStartTime,
    startTime,
    endTime,
    formatTime,
  } = useVideoTrimStore();

  // UI calculations
  const screenWidth = useScreenDimensions().width - 32; // Width of the screen minus the padding
  const scrollWidth = (videoDuration / 1000) * pixelForEachSecond; // Width of the scroll view
  const thumbnailWidth =
    scrollWidth / Math.min(Math.floor(videoDuration / 1000), 20); // Width of each thumbnail
  const markerGap = selectedTrimmingDuration * pixelForEachSecond; // Gap between the markers
  const overlayWidth = screenWidth - markerGap; // Width of the overlay

  // Handle scrolling
  const handleScroll = (event: any) => {
    if (!player) return;
    const scrollX = event.nativeEvent.contentOffset.x;
    const currentTimeInSeconds =
      (scrollX / scrollWidth) * (videoDuration / 1000);
    setStartTime(currentTimeInSeconds);
    player.currentTime = currentTimeInSeconds;
    if (player.playing) {
      player.pause();
    }
  };

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  return (
    <View className="w-full flex flex-col gap-4">
      {/* Video start and end times text */}
      <View className="flex flex-row items-center w-full justify-start">
        <Text className="text-text font-medium tracking-tight opacity-50">
          {formatTime(startTime)} - {formatTime(endTime)}
        </Text>
      </View>
      {/* Timeline and markers */}
      <View className="flex w-full h-[60px] rounded-xl overflow-hidden">
        <View
          style={{ gap: markerGap }}
          className="flex flex-row items-center absolute left-0 h-full w-full z-20 pointer-events-none"
        >
          <View className="w-[3px] bg-tint h-full rounded-full"></View>
          <View className="w-[3px] bg-tint h-full rounded-full"></View>
        </View>

        <View
          style={{ width: overlayWidth }}
          className="h-full bg-white/70 dark:bg-black/70 absolute right-0 z-10 pointer-events-none"
        ></View>

        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            width: scrollWidth + overlayWidth,
          }}
          horizontal
        >
          {thumbnails.map((thumbnail, index) => (
            <Image
              key={index}
              source={thumbnail}
              style={{ width: thumbnailWidth, height: "100%" }}
              placeholder={{ blurhash }}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

function ClipDurationSelector() {
  const {
    trimmingDurationOptions,
    selectedTrimmingDuration,
    setSelectedTrimmingDuration,
  } = useVideoTrimStore();
  return (
    <View className="flex flex-col gap-3 items-start">
      <Text className="text-text opacity-50">{i18n.t("clip_duration")}</Text>
      <View className="flex flex-row items-center w-full gap-2">
        {trimmingDurationOptions.map((duration) => {
          const isSelected = selectedTrimmingDuration === duration;
          return (
            <TouchableOpacity
              onPress={() => setSelectedTrimmingDuration(duration)}
              className={`px-6 py-2 rounded-full ${
                isSelected ? "bg-tint" : "bg-neutral-200 dark:bg-neutral-800"
              }`}
              key={duration}
            >
              <Text
                className={`font-medium ${
                  isSelected ? "text-white" : "text-text opacity-40"
                }`}
              >
                {i18n.t("second", { second: duration })}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function NextButton() {
  const insets = useScreenDimensions().insets;
  const router = useRouter();

  const { player, startTime } = useVideoTrimStore();

  const navigate = () => {
    if (!player) return;
    player.pause();
    player.currentTime = startTime;
    router.push("/video-add");
  };

  return (
    <TouchableOpacity
      onPress={navigate}
      style={{ bottom: insets.bottom }}
      className="w-full rounded-3xl bg-tint h-[50px] flex items-center justify-center mt-auto"
    >
      <Text className="font-semibold text-lg text-white">{i18n.t("next")}</Text>
    </TouchableOpacity>
  );
}
