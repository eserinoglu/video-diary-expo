import { FFmpegKit, ReturnCode } from "ffmpeg-kit-react-native";

const formatStartTime = (startTime: number): string => {
  const hours = Math.floor(startTime / 3600);
  const minutes = Math.floor((startTime % 3600) / 60);
  const seconds = Math.floor(startTime % 60);
  const hourString = hours.toString().padStart(2, "0");
  const minuteString = minutes.toString().padStart(2, "0");
  const secondString = seconds.toString().padStart(2, "0");

  return `${hourString}:${minuteString}:${secondString}`;
};

export const cropVideo = async (
  videoUri: string,
  startTime: number,
  trimDuration: number,
  outputPath: string
): Promise<{ success: boolean; outputPath: string }> => {
  try {
    // Trim command
    const command = `-i ${videoUri} -ss ${formatStartTime(
      startTime
    )} -t ${trimDuration} -c copy ${outputPath}`;

    // Execute the command
    const session = await FFmpegKit.execute(command);
    const returnCode = await session.getReturnCode();
    if (ReturnCode.isSuccess(returnCode)) {
      return { success: true, outputPath };
    } else {
      const logs = await session.getAllLogs();
      console.error(`FFmpeg failed with trimming: ${logs}`);
      return { success: false, outputPath: "" };
    }
  } catch (error) {
    console.error("Trimming error (videoService.ts):", error);
    throw error;
  }
};
