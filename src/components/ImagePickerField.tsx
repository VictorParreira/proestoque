import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useMemo, useState } from "react";
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
  const [isPicking, setIsPicking] = useState(false);

  const [previewUri, setPreviewUri] = useState<string | undefined>(value);

  useEffect(() => {
    setPreviewUri(value || undefined);
  }, [value]);

  const hasError = Boolean(error);
  const hasImage = Boolean(previewUri);

  const pickImage = async () => {
    if (isPicking) return;

    try {
      setIsPicking(true);

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

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
        const selectedUri = result.assets[0].uri;

        setPreviewUri(selectedUri);
        onChange(selectedUri);
      }
    } catch {
      Alert.alert(
        "Não foi possível abrir a galeria",
        "Tente novamente ou verifique as permissões do aplicativo.",
      );
    } finally {
      setIsPicking(false);
    }
  };

  const removeImage = () => {
    setPreviewUri(undefined);
    onChange("");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.pickerButton,
          hasImage ? styles.pickerButtonFilled : styles.pickerButtonEmpty,
          hasError && styles.pickerError,
          isPicking && styles.pickerButtonDisabled,
        ]}
        onPress={pickImage}
        disabled={isPicking}
        activeOpacity={0.72}
        accessibilityRole="button"
        accessibilityLabel={
          hasImage ? "Alterar foto do produto" : "Adicionar foto do produto"
        }
        accessibilityHint={
          hasError
            ? `Erro: ${error}. Abre a galeria para selecionar uma imagem.`
            : "Abre a galeria para selecionar uma imagem."
        }
        accessibilityState={{
          selected: hasImage,
          disabled: isPicking,
        }}
      >
        {hasImage ? (
          <>
            <Image
              source={{ uri: previewUri }}
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

              <Text style={styles.editOverlayText}>
                {isPicking ? "Abrindo..." : "Alterar"}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.removeButton}
              activeOpacity={0.72}
              accessibilityRole="button"
              accessibilityLabel="Remover foto do produto"
              onPress={(event) => {
                event.stopPropagation();
                removeImage();
              }}
            >
              <Ionicons
                name="close"
                size={16}
                color={theme.colors.primaryContrast}
              />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.iconWrapper}>
              <Ionicons
                name={isPicking ? "hourglass-outline" : "camera-outline"}
                size={28}
                color={theme.colors.primary}
              />
            </View>

            <Text style={styles.placeholderText}>
              {isPicking ? "Abrindo galeria..." : "Adicionar foto do produto"}
            </Text>

            <Text style={styles.placeholderSubtext}>
              {isPicking ? "Aguarde um instante" : "Toque para abrir a galeria"}
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

    pickerButtonDisabled: {
      opacity: theme.opacity.disabled,
    },

    removeButton: {
      position: "absolute",
      top: theme.spacing.sm + theme.spacing.xs,
      right: theme.spacing.sm + theme.spacing.xs,
      width: 32,
      height: 32,
      borderRadius: theme.borderRadius.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.scrim,
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
