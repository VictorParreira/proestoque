import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";
import { LogoProEstoque } from "./LogoProEstoque";

const { width } = Dimensions.get("window");

type SplashScreenProps = {
  onComplete?: () => void;
};

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const progress = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start(() => {
      onComplete?.();
    });
  }, [opacity, progress, onComplete]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity }]}>
        <LogoProEstoque size="lg" />
        <Text style={styles.tagline}>Gestão de estoque inteligente</Text>
      </Animated.View>

      <Animated.View style={[styles.bottomContainer, { opacity }]}>
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[styles.progressBar, { width: progressWidth }]}
          />
        </View>

        <Text style={styles.loadingText}>Verificando sessão...</Text>
      </Animated.View>
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
    },

    content: {
      alignItems: "center",
      transform: [{ translateY: -30 }],
    },

    tagline: {
      marginTop: theme.spacing.sm + theme.spacing.xs,
      color: theme.colors.textSecondary,
      fontSize: theme.typography.subheadline.fontSize,
      lineHeight: theme.typography.subheadline.lineHeight,
      fontWeight: "500",
      letterSpacing: 0.2,
      textAlign: "center",
    },

    bottomContainer: {
      position: "absolute",
      bottom: 60,
      width: width * 0.6,
      alignItems: "center",
    },

    progressBarContainer: {
      width: "100%",
      height: 8,
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: theme.borderRadius.pill,
      overflow: "hidden",
    },

    progressBar: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.pill,
    },

    loadingText: {
      marginTop: theme.spacing.sm + theme.spacing.xs,
      color: theme.colors.textTertiary,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "600",
      letterSpacing: 0.2,
      textAlign: "center",
    },
  });
