import { ImagePickerAsset } from "expo-image-picker";
import { VideoPlayer, VideoThumbnail } from "expo-video";
import { create } from "zustand";

interface VideoStore {
  // Video and upload status
  video: ImagePickerAsset | null;
  isUploading: boolean;

  // Player and video times
  player: VideoPlayer | null;
  startTime: number;
  endTime: number;
  videoDuration: number;

  // UI options
  trimmingDurationOptions: number[];
  selectedTrimmingDuration: number;
  thumbnails: VideoThumbnail[];
  pixelForEachSecond: number;

  // Setter functions
  setVideo: (video: ImagePickerAsset | null) => Promise<void>;
  setIsUploading: (isUploading: boolean) => void;
  setPlayer: (player: VideoPlayer) => void;
  setStartTime: (startTime: number) => void;
  setEndTime: (endTime: number) => void;
  setVideoDuration: (videoDuration: number) => void;
  setSelectedTrimmingDuration: (selectedTrimmingDuration: number) => void;

  // Thumbnail generation
  generateThumbnails: () => Promise<void>;
  // Time formatter
  formatTime: (seconds: number) => string;
}

export const useVideoStore = create<VideoStore>((set, get) => {
  return {
    video: null,
    isUploading: false,
    player: null,
    startTime: 0,
    endTime: 5,
    videoDuration: 0,
    trimmingDurationOptions: [5, 10],
    selectedTrimmingDuration: 5,
    thumbnails: [],
    pixelForEachSecond: 200 / 5,

    // Setters
    setVideo: async (video) => {
      set({ video: video || null });

      // Video değişince duration ve start/end parametreleri de otomatik sıfırlansın
      if (video) {
        set({
          startTime: 0,
          videoDuration: video.duration || 0,
        });

        // End time da otomatik güncelle, seçili kesme süresine göre
        const { selectedTrimmingDuration } = get();
        const durationInSeconds = (video.duration || 0) / 1000;
        set({
          endTime: Math.min(selectedTrimmingDuration, durationInSeconds),
        });
      } else {
        set({
          startTime: 0,
          endTime: 5,
          videoDuration: 0,
          thumbnails: [],
        });
      }
    },
    setIsUploading: (isUploading) => set({ isUploading }),
    setPlayer: (player) => set({ player }),
    setStartTime: (startTime) => {
      set({ startTime });

      // startTime değişince endTime de otomatik güncellensin
      const { selectedTrimmingDuration, videoDuration } = get();
      const durationInSeconds = videoDuration / 1000;
      set({
        endTime: Math.min(
          startTime + selectedTrimmingDuration,
          durationInSeconds
        ),
      });
    },
    setEndTime: (endTime) => set({ endTime }),
    setVideoDuration: (videoDuration) => set({ videoDuration }),
    setSelectedTrimmingDuration: (selectedTrimmingDuration) => {
      set({ selectedTrimmingDuration });

      // Süre değişince end time da otomatik güncellensin
      const { startTime, videoDuration } = get();
      const durationInSeconds = videoDuration / 1000;
      set({
        endTime: Math.min(
          startTime + selectedTrimmingDuration,
          durationInSeconds
        ),
        pixelForEachSecond: 200 / selectedTrimmingDuration,
      });
    },
    // Thumbnail genertation
    generateThumbnails: async () => {
      const { video, player } = get();

      if (!video?.duration || !player) return;

      set({ videoDuration: video.duration });

      const durationInSeconds = video.duration / 1000;
      const thumbCount = Math.min(Math.floor(durationInSeconds), 20);
      const thumbsArray = Array.from(
        { length: thumbCount },
        (_, i) => i * (durationInSeconds / thumbCount)
      );

      try {
        const thumbnails = await player.generateThumbnailsAsync(thumbsArray);
        set({ thumbnails });

        const { selectedTrimmingDuration, startTime } = get();
        set({
          endTime: Math.min(
            startTime + selectedTrimmingDuration,
            durationInSeconds
          ),
        });
      } catch (error) {
        console.error("Thumbnail generation error:", error);
      }
    },
    // Yardımcı fonksiyonlar
    formatTime: (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    },
  };
});
