import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../constants/theme";

type ImagePickerFieldProps = {
  value?: string;
  onChange: (uri: string) => void;
  error?: string;
};

export function ImagePickerField({
  value,
  onChange,
  error,
}: ImagePickerFieldProps) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.pickerButton, error ? styles.pickerError : null]}
        onPress={pickImage}
        activeOpacity={0.8}
      >
        {value ? (
          <Image source={{ uri: value }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons
              name="camera-outline"
              size={32}
              color={theme.colors.primary}
            />
            <Text style={styles.placeholderText}>Adicionar foto</Text>
          </View>
        )}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  pickerButton: {
    width: "100%",
    height: 150,
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  pickerError: {
    borderColor: "#dc2626",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    color: theme.colors.textLight,
    fontWeight: "500",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 12,
    marginTop: 4,
  },
});
