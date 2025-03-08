import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { useVideoDatabase } from "@/stores/useVideoDatabase";
import i18n from "@/locales/i18n";
import { Feather } from "@expo/vector-icons";
import { useColorTheme } from "@/utils/useColorTheme";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from "@/types/FormSchema";
import TextField from "../Shared/TextField";
import BottomSheet from "../Shared/BottomSheet";

interface VideoEditSheetProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

export default function VideoEditSheet({
  isVisible,
  setIsVisible,
}: VideoEditSheetProps) {
  const { updateVideo, displayedVideo } = useVideoDatabase();
  const isDarkMode = useColorTheme().colorScheme === "dark";

  const onSubmit = (data: { title: string; description: string }) => {
    if (!displayedVideo) return;
    updateVideo(displayedVideo.id, data.title, data.description);
    setIsVisible(false);
  };
  const {
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: displayedVideo?.title || "",
      description: displayedVideo?.description || "",
    },
    mode: "onChange",
  });

  const keyboardHeight = Keyboard.metrics()?.height || 0;

  return (
    <BottomSheet
      height={360}
      dismiss={() => setIsVisible(false)}
      isVisible={isVisible}
    >
      <View className="w-full h-full flex flex-col">
        {/* Header */}
        <View className="w-full flex flex-row items-center justify-between">
          <Text className="text-text text-3xl font-semibold">
            {i18n.t("edit_video")}
          </Text>
          <TouchableOpacity
            onPress={() => setIsVisible(false)}
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
        <KeyboardAvoidingView
          behavior="padding"
          className="flex-col justify-start gap-4 w-full"
        >
          <TextField
            errors={errors}
            control={control}
            name="title"
            placeholder="title"
          />
          <TextField
            errors={errors}
            control={control}
            name="description"
            placeholder="description"
            isDescription
          />
        </KeyboardAvoidingView>
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
    </BottomSheet>
  );
}
