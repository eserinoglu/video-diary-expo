import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cropVideo } from "@/services/videoService";
import * as FileSystem from "expo-file-system";
import { insertVideo, VideoDiary } from "@/services/databaseService";

export const useVideoCrop = () => {
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
        const newVideo: VideoDiary = {
          id: Date.now().toString(),
          title,
          description,
          videoUri: result.outputPath,
          createdAt: Date.now().toString(),
        };

        await insertVideo(newVideo);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["croppedVideos"] });
    },
  });
};
