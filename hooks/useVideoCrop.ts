import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cropVideo } from "@/services/videoService";
import * as FileSystem from "expo-file-system";
import { useVideoDatabase } from "@/stores/useVideoDatabase";
import { VideoDiary } from "@/types/VideoDiary";

export const useVideoCrop = () => {
  const queryClient = useQueryClient();

  const { insertVideo } = useVideoDatabase();

  interface CropVideoMutation {
    videoUri: string;
    startTime: number;
    trimDuration: number;
    title: string;
    description: string;
    width: number;
    height: number;
  }

  return useMutation({
    mutationFn: async ({
      videoUri,
      startTime,
      trimDuration,
      title,
      description,
      width,
      height,
    }: CropVideoMutation) => {
      try {
        const outputFileName = `${title
          .toLowerCase()
          .trim()}-${Date.now().toString()}.mp4`;
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
            width,
            height,
          };

          await insertVideo(newVideo);
        }

        return result;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["croppedVideos"] });
    },
    onError: (error) => {
      console.log(error);
    }
  });
};
