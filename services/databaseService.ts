import * as SQLite from "expo-sqlite";
import { VideoDiary } from "@/types/VideoDiary";

const db = SQLite.openDatabaseSync("videoDiary.db");

export const initDatabase = async () => {
  try {
    await db.execAsync(
      "CREATE TABLE IF NOT EXISTS videos (id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, videoUri TEXT NOT NULL, createdAt TEXT NOT NULL, width BIGINT, height BIGINT)"
    );
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};

export const insertVideo = async (video: VideoDiary) => {
  try {
    await db.runAsync(
      "INSERT INTO videos (id, title, description, videoUri, createdAt, width, height) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        video.id,
        video.title,
        video.description,
        video.videoUri,
        video.createdAt,
        video.width,
        video.height,
      ]
    );
  } catch (error) {
    console.error("Insert video error:", error);
    throw error;
  }
};

export const deleteVideo = async (id: string) => {
  try {
    await db.runAsync("DELETE FROM videos WHERE id = ?", [id]);
  } catch (error) {
    console.error("Delete video error:", error);
    throw error;
  }
};

export const getAllVideos = async (): Promise<VideoDiary[]> => {
  try {
    const results = await db.getAllAsync("SELECT * FROM videos");
    return results as VideoDiary[];
  } catch (error) {
    console.error("Get all videos error:", error);
    throw error;
  }
};

export const getVideoById = async (id: string): Promise<VideoDiary> => {
  try {
    const result = await db.getFirstAsync("SELECT * FROM videos WHERE id = ?", [
      id,
    ]);
    return result as VideoDiary;
  } catch (error) {
    console.error("Get video by id error:", error);
    throw error;
  }
};

export const updateVideo = async (
  id: string,
  title: string,
  description: string
): Promise<VideoDiary> => {
  try {
    await db.runAsync(
      "UPDATE videos SET title = ?, description = ? WHERE id = ?",
      [title, description, id]
    );
    return await getVideoById(id);
  } catch (error) {
    console.error("Update video error:", error);
    throw error;
  }
};
