import { create } from "zustand";
import { VideoDiary } from "@/types/VideoDiary";
import { updateVideo } from "@/services/databaseService";

interface VideEditState {
  selectedVideo: VideoDiary | null;
  isUpdating: boolean;
  setSelectedVideo: (video: VideoDiary | null) => void;
  updateVideo: (
    id: string,
    title: string,
    description: string
  ) => Promise<void>;
}

export const useVideoEdit = create<VideEditState>((set, get) => {
  return {
    selectedVideo: null,
    isUpdating: false,
    setSelectedVideo: (video) => set({ selectedVideo: video }),
    updateVideo: async (id, title, description) => {
      set({ isUpdating: true });
      await updateVideo(id, title, description);
      set({ selectedVideo: null , isUpdating: false });
    },
  };
});
