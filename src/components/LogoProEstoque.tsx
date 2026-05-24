import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function LogoProEstoque({ size = "md" }: LogoProps) {
  const dimensions = {
    sm: { icon: 20, container: 40, text: 20, radius: 12 },
    md: { icon: 32, container: 64, text: 32, radius: 20 },
    lg: { icon: 48, container: 96, text: 42, radius: 28 },
  };

  const dim = dimensions[size];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            width: dim.container,
            height: dim.container,
            borderRadius: dim.radius,
          },
        ]}
      >
        <Ionicons name="cube" size={dim.icon} color="#ffffff" />
      </View>

      <Text style={[styles.text, { fontSize: dim.text }]}>
        Pro<Text style={styles.textHighlight}>Estoque</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,

    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  text: {
    fontWeight: "800",
    color: theme.colors.primary,
    letterSpacing: -0.5,
  },
  textHighlight: {
    color: "#111827",
  },
});
