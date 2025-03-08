import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useScreenDimensions } from "@/utils/useScreenDimensions";
import i18n from "@/locales/i18n";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorTheme } from "@/utils/useColorTheme";
import { useVideoCrop } from "@/hooks/useVideoCrop";
import { useVideoTrimStore } from "@/stores/useVideoTrimStore";
import { FormSchema } from "@/types/FormSchema";
import TextField from "@/components/Shared/TextField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function VideoAdd() {
  const { insets } = useScreenDimensions();
  return (
    <View
      style={{ paddingTop: insets.top + 10 }}
      className="flex flex-col flex-1 bg-background gap-4 px-4"
    >
      {/* Navigation header and navigation title */}
      <NavigationHeader />
      <Text className="text-4xl font-semibold text-text">
        {i18n.t("details")}
      </Text>
      {/* Form section */}
      <FormSection />
    </View>
  );
}

function NavigationHeader() {
  const router = useRouter();
  const isDarkMode = useColorTheme().colorScheme === "dark";
  return (
    <Pressable
      onPress={() => router.back()}
      className="flex flex-row items-center"
    >
      <Feather
        name="arrow-left"
        size={24}
        color={isDarkMode ? "white" : "black"}
      />
    </Pressable>
  );
}

// Form section
function FormSection() {
  const formSchema = FormSchema;
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onChange",
  });

  const { mutate, isPending, isError, error, isSuccess } = useVideoCrop();
  const { video, startTime, selectedTrimmingDuration } = useVideoTrimStore();

  const handleVideoCrop = () => {
    if (!video) return;
    mutate({
      videoUri: video.uri,
      startTime: startTime,
      trimDuration: selectedTrimmingDuration,
      title: getValues("title"),
      description: getValues("description"),
      width: video.width,
      height: video.height,
    });
  };

  // Submit function
  const onSubmit = () => {
    handleVideoCrop();
  };

  return (
    <ScrollView bounces={false} className="flex-1">
      {isPending && <ActivityIndicator className="text-text" />}
      {isError && <Text className="text-red-500">{error?.message}</Text>}
      {isSuccess && (
        <Text className="text-green-500">Video cropped successfully</Text>
      )}
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-col flex-1 gap-4"
      >
        <TextField name="title" placeholder="awesome_clip" control={control} />
        <TextField
          name="description"
          placeholder="description_placeholder"
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
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
