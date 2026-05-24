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
      activeOpacity={0.8}
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
          color={isOutline ? theme.colors.primary : "#ffffff"}
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
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    flexDirection: "row",
  },
  buttonSolid: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  fullWidth: {
    width: "100%",
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  textSolid: {
    color: "#ffffff",
  },
  textOutline: {
    color: theme.colors.primary,
  },
});
