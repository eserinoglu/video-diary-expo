import {
  View,
  Text,
  Pressable,
  TextInput,
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
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "min_title_warning" })
    .max(20, { message: "max_title_warning" }),
  description: z
    .string()
    .min(10, { message: "min_description_warning" })
    .max(100, { message: "max_description_warning" }),
});

import { useVideoCrop } from "@/hooks/useVideoCrop";
import { useVideoStore } from "@/stores/useVideoStore";
function FormSection() {
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
  const { video, startTime, selectedTrimmingDuration } = useVideoStore();

  const handleVideoCrop = () => {
    if (!video) return;
    mutate({
      videoUri: video.uri,
      startTime: startTime,
      trimDuration: selectedTrimmingDuration,
      title: getValues("title"),
      description: getValues("description"),
      width : video.width,
      height: video.height,
    });
  };

  // Submit function
  const onSubmit = () => {
    handleVideoCrop();
  };

  // Error text component
  const errorText = (text: string | undefined) => {
    const errorText = text;
    const animatedErrorBoxStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(errorText ? 1 : 0),
        transform: [{ translateY: withTiming(errorText ? 0 : -10) }],
      };
    });
    return (
      <Animated.Text
        style={[animatedErrorBoxStyle]}
        className="text-red-500 text-sm"
      >
        {i18n.t(errorText || "")}
      </Animated.Text>
    );
  };

  // Textfield component
  const textField = (
    name: "title" | "description",
    placeholder: string,
    isDescription: boolean = false
  ) => {
    return (
      <View className="w-full flex-flex-col gap-2">
        <Text className="text-xl font-medium opacity-50 text-text">
          {i18n.t(name)}
        </Text>
        <Controller
          control={control}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder={i18n.t(placeholder)}
              className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-3 text-xl text-text flex items-start justify-start"
              style={{ height: isDescription ? 100 : 50 }}
              multiline={isDescription}
              numberOfLines={isDescription ? 5 : 1}
            />
          )}
          name={name === "title" ? "title" : "description"}
        />
        {errorText(errors[name]?.message)}
      </View>
    );
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
        {textField("title", "awesome_clip")}
        {textField("description", "description_placeholder", true)}
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
