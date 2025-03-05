import { create } from "zustand";

interface VideoStore {
  video: File | null;
  setVideo: (video?: File) => void;
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  video: null,
  setVideo: (video) => set({ video }),
}));
