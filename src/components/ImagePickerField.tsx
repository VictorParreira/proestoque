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
        style={[
          styles.pickerButton,
          value ? styles.pickerButtonFilled : styles.pickerButtonEmpty,
          error ? styles.pickerError : null,
        ]}
        onPress={pickImage}
        activeOpacity={0.85}
      >
        {value ? (
          <>
            <Image source={{ uri: value }} style={styles.image} />
            <View style={styles.editOverlay}>
              <Ionicons name="pencil" size={14} color="#fff" />
              <Text style={styles.editOverlayText}>Alterar</Text>
            </View>
          </>
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.iconWrapper}>
              <Ionicons name="camera" size={28} color={theme.colors.primary} />
            </View>
            <Text style={styles.placeholderText}>
              Adicionar foto do produto
            </Text>
            <Text style={styles.placeholderSubtext}>
              Toque para abrir a galeria
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color="#dc2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  pickerButton: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerButtonEmpty: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  pickerButtonFilled: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    borderStyle: "solid",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  pickerError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    alignItems: "center",
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f5f3ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  placeholderText: {
    color: "#1f2937",
    fontSize: 15,
    fontWeight: "600",
  },
  placeholderSubtext: {
    color: "#6b7280",
    fontSize: 13,
    marginTop: 4,
  },
  editOverlay: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  editOverlayText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
    fontWeight: "500",
    marginLeft: 4,
  },
});
