import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";

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
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const hasError = Boolean(error);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permissão necessária",
        "Permita o acesso à galeria para adicionar uma foto ao produto.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.72,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      onChange(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          value ? styles.pickerButtonFilled : styles.pickerButtonEmpty,
          hasError && styles.pickerError,
        ]}
        onPress={pickImage}
        activeOpacity={0.72}
        accessibilityRole="button"
        accessibilityLabel={
          value ? "Alterar foto do produto" : "Adicionar foto do produto"
        }
        accessibilityHint={
          hasError
            ? `Erro: ${error}. Abre a galeria para selecionar uma imagem.`
            : "Abre a galeria para selecionar uma imagem."
        }
        accessibilityState={{
          selected: Boolean(value),
        }}
      >
        {value ? (
          <>
            <Image
              source={{ uri: value }}
              style={styles.image}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />

            <View style={styles.editOverlay}>
              <Ionicons
                name="pencil-outline"
                size={14}
                color={theme.colors.primaryContrast}
              />

              <Text style={styles.editOverlayText}>Alterar</Text>
            </View>
          </>
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.iconWrapper}>
              <Ionicons
                name="camera-outline"
                size={28}
                color={theme.colors.primary}
              />
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

      {hasError && (
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={14}
            color={theme.colors.error}
          />

          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md + theme.spacing.xs,
    },

    pickerButton: {
      width: "100%",
      height: 160,
      maxHeight: 160,
      borderRadius: theme.borderRadius.md,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    },

    pickerButtonEmpty: {
      backgroundColor: theme.colors.inputBackground,
      borderWidth: theme.borderWidth.md,
      borderColor: theme.colors.inputBorder,
      borderStyle: "dashed",
    },

    pickerButtonFilled: {
      backgroundColor: theme.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      borderStyle: "solid",
    },

    pickerError: {
      borderColor: theme.colors.error,
      backgroundColor: theme.colors.errorSoft,
    },

    image: {
      ...StyleSheet.absoluteFillObject,
      width: "100%",
      height: "100%",
    },

    placeholder: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.lg,
    },

    iconWrapper: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.primarySubtle,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.sm + theme.spacing.xs,
    },

    placeholderText: {
      color: theme.colors.text,
      fontSize: theme.typography.subheadline.fontSize,
      lineHeight: theme.typography.subheadline.lineHeight,
      fontWeight: "700",
      textAlign: "center",
    },

    placeholderSubtext: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      marginTop: theme.spacing.xs,
      textAlign: "center",
    },

    editOverlay: {
      position: "absolute",
      right: theme.spacing.sm + theme.spacing.xs,
      bottom: theme.spacing.sm + theme.spacing.xs,
      minHeight: 32,
      paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
      paddingVertical: theme.spacing.xs + theme.spacing.xxs,
      borderRadius: theme.borderRadius.pill,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.scrim,
    },

    editOverlayText: {
      color: theme.colors.primaryContrast,
      fontSize: theme.typography.caption1.fontSize,
      lineHeight: theme.typography.caption1.lineHeight,
      fontWeight: "700",
      marginLeft: theme.spacing.xs,
    },

    errorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: theme.spacing.sm,
      marginLeft: theme.spacing.xs,
    },

    errorText: {
      flex: 1,
      color: theme.colors.error,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "600",
      marginLeft: theme.spacing.xs,
    },
  });
