import { create } from "zustand";
import { VideoDiary } from "@/types/VideoDiary";
import {
  insertVideo,
  updateVideo,
  deleteVideo,
  getAllVideos,
  getVideoById,
} from "@/services/databaseService";

interface VideoDatabaseState {
  allVideos: VideoDiary[];
  displayedVideo: VideoDiary | null;
  setDisplayedVideo: (video: VideoDiary | null) => void;
  insertVideo: (video: VideoDiary) => Promise<void>;
  updateVideo: (
    id: string,
    title: string,
    description: string
  ) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  getAllVideos: () => Promise<void>;
  getVideoById: (id: string) => Promise<VideoDiary>;
}

export const useVideoDatabase = create<VideoDatabaseState>((set, get) => {
  return {
    allVideos: [],
    displayedVideo: null,
    setDisplayedVideo: (video: VideoDiary | null) => {
      set({ displayedVideo: video });
    },
    insertVideo: async (video: VideoDiary) => {
      await insertVideo(video);
      await get().getAllVideos();
    },
    updateVideo: async (id: string, title: string, description: string) => {
      const video = await updateVideo(id, title, description);
      set({ displayedVideo: video})
      get().getAllVideos();
    },
    deleteVideo: async (id: string) => {
      await deleteVideo(id)
      set({ displayedVideo: null, allVideos: get().allVideos.filter((v) => v.id !== id) });
    },
    getAllVideos: async () => {
      try {
        const videos = await getAllVideos();
        set({ allVideos: videos });
      } catch (error) {
        console.error(error);
      }
    },
    getVideoById: async (id: string) => {
      const video = await getVideoById(id);
      return video;
    },
  };
});
