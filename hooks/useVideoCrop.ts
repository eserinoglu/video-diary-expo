import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cropVideo } from "@/services/videoService";
import { useVideoStore } from "@/stores/useVideoStore";
import * as FileSystem from "expo-file-system";

export const useVideoCrop = () => {
  const { addCroppedVideo } = useVideoStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      videoUri,
      startTime,
      trimDuration,
      title,
      description,
    }: {
      videoUri: string;
      startTime: number;
      trimDuration: number;
      title: string;
      description: string;
    }) => {
      const outputFileName = `${title}-${Date.now()}.mp4`;
      const outputPath = `${FileSystem.documentDirectory}videos/${outputFileName}`;

      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}videos/`,
        { intermediates: true }
      ).catch(() => {});

      const result = await cropVideo(
        videoUri,
        startTime,
        trimDuration,
        outputPath
      );

      if (result.success) {
        const newVideo = {
          id: Date.now().toString(),
          title,
          description,
          uri: result.outputPath,
          createdAt: Date.now().toString(),
        };
        addCroppedVideo(newVideo.uri);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["croppedVideos"] });
    },
  });
};
