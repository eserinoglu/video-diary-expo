import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { useVideoEdit } from "@/stores/useVideoEdit";
import i18n from "@/locales/i18n";
import { Feather } from "@expo/vector-icons";
import { useColorTheme } from "@/utils/useColorTheme";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from "@/types/FormSchema";
import TextField from "../Shared/TextField";
import BottomSheet from "../Shared/BottomSheet";

export default function VideoEditSheet() {
  const { selectedVideo, setSelectedVideo, updateVideo } = useVideoEdit();
  const isDarkMode = useColorTheme().colorScheme === "dark";
  const formSchema = FormSchema;

  const onSubmit = (data: { title: string; description: string }) => {
    if (selectedVideo) {
      updateVideo(selectedVideo.id, data.title, data.description);
    }
  };
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: selectedVideo?.title || "",
      description: selectedVideo?.description || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (selectedVideo) {
      reset({
        title: selectedVideo.title,
        description: selectedVideo.description,
      });
    }
  }, [selectedVideo]);

  return (
    <BottomSheet
      height={380}
      dismiss={() => setSelectedVideo(null)}
      isVisible={selectedVideo !== null}
    >
      <View className="w-full h-full flex flex-col">
        {/* Header */}
        <View className="w-full flex flex-row items-center justify-between">
          <Text className="text-text text-3xl font-semibold">
            {i18n.t("edit_video")}
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedVideo(null)}
            className="bg-neutral-200 p-2 rounded-full dark:bg-neutral-700"
          >
            <Feather
              name="x"
              color={isDarkMode ? "white" : "black"}
              style={{ opacity: 0.5 }}
              size={18}
            />
          </TouchableOpacity>
        </View>
        {/* Form */}
        <View className="flex-col flex-1 justify-end gap-4 w-full">
          <TextField name="title" placeholder="title" control={control} />
          <TextField
            name="description"
            placeholder="description"
            isDescription
            control={control}
          />
          <TouchableOpacity
            disabled={!isValid}
            onPress={handleSubmit(onSubmit)}
            className={`${
              isValid ? "bg-tint" : "bg-neutral-500"
            } rounded-3xl p-4 mt-4`}
          >
            <Text className="text-white text-center text-lg font-semibold">
              {i18n.t("save")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
}
