import { ImagePickerAsset } from "expo-image-picker";
import { create } from "zustand";

interface VideoStore {
  video: ImagePickerAsset | null;
  setVideo: (video: ImagePickerAsset | null) => Promise<void>;
  isUploading : boolean;
  setIsUploading : (isUploading : boolean) => void;
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  video: null,
  isUploading: false,
  setIsUploading: (isUploading) => set({ isUploading }),
  setVideo: async (video?) => set({ video: video ? video : null }),
}));
