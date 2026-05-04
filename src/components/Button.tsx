import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { theme } from "../constants/theme";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  fullWidth?: boolean;
  loading?: boolean;
  variant?: "solid" | "outline";
}

export function Button({
  title,
  fullWidth,
  loading,
  variant = "solid",
  style,
  ...rest
}: ButtonProps) {
  const isOutline = variant === "outline";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isOutline ? styles.buttonOutline : styles.buttonSolid,
        fullWidth && styles.fullWidth,
        style,
      ]}
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={isOutline ? theme.colors.primary : theme.colors.background}
        />
      ) : (
        <Text
          style={[
            styles.text,
            isOutline ? styles.textOutline : styles.textSolid,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  buttonSolid: {
    backgroundColor: theme.colors.primary,
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  textSolid: {
    color: theme.colors.background,
  },
  textOutline: {
    color: theme.colors.primary,
  },
});
