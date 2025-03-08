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
      style={{ paddingTop: insets.top + 20 }}
      className="flex flex-col flex-1 bg-background gap-6 px-4"
    >
      {/* Navigation header and navigation title */}
      <NavigationHeader />
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
      className="flex flex-row items-center gap-2"
    >
      <Feather
        name="chevron-left"
        size={26}
        color={isDarkMode ? "white" : "black"}
      />
      <Text className="text-3xl font-semibold text-text">
        {i18n.t("details")}
      </Text>
    </Pressable>
  );
}

// Form section
function FormSection() {
  const formSchema = FormSchema;
  const {
    handleSubmit,
    getValues,
    control,
    formState: { isValid, errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useVideoCrop();
  const { video, startTime, selectedTrimmingDuration } = useVideoTrimStore();

  const router = useRouter();

  const handleVideoCrop = () => {
    if (!video) return;
    mutate(
      {
        videoUri: video.uri,
        startTime: startTime,
        trimDuration: selectedTrimmingDuration,
        title: getValues("title"),
        description: getValues("description"),
        width: video.width,
        height: video.height,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            router.push({
              pathname: "/response-screen",
              params: { status: "success" },
            });
          } else {
            router.push({
              pathname: "/response-screen",
              params: { status: "error" },
            });
          }
        },
        onError: () => {
          router.push({
            pathname: "/response-screen",
            params: { status: "error" },
          });
        },
      }
    );
  };

  // Submit function
  const onSubmit = () => {
    handleVideoCrop();
  };

  return (
    <ScrollView bounces={false} className="flex-1">
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-col flex-1 gap-4"
      >
        <TextField
          control={control}
          errors={errors}
          name="title"
          placeholder="awesome_clip"
        />
        <TextField
          control={control}
          errors={errors}
          name="description"
          placeholder="description_placeholder"
          isDescription
        />
      </KeyboardAvoidingView>
      <TouchableOpacity
        disabled={!isValid || isPending}
        onPress={() => {
          handleSubmit(onSubmit)();
        }}
        className={`${
          isValid ? "bg-tint" : "bg-neutral-500"
        } rounded-3xl h-[45px] mt-4 flex items-center justify-center`}
      >
        {isPending ? (
          <ActivityIndicator className="text-white" />
        ) : (
          <Text className="text-white text-center text-lg font-semibold">
            {i18n.t("save")}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
