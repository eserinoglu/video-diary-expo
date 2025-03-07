import { View, Text } from "react-native";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { TextInput } from "react-native-gesture-handler";
import i18n from "@/locales/i18n";

export default function TextField({
  name,
  placeholder,
  isDescription = false,
  control,
}: {
  name: "title" | "description";
  placeholder: string;
  isDescription?: boolean;
  control: Control<{ title: string; description: string }>;
}) {
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
    </View>
  );
}
