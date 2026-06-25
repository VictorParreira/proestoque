import { BlurView } from "expo-blur";
import React, { useEffect, useMemo, useRef, type ReactNode } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";

type ProductModalSheetProps = {
  children: ReactNode;
  heightRatio?: number;
  closeOnBackdropPress?: boolean;
  onRequestClose?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

const DEFAULT_SHEET_HEIGHT_RATIO = 0.72;
const SHEET_HORIZONTAL_MARGIN = 16;
const SHEET_ENTRY_TRANSLATE_Y = 28;

export function ProductModalSheet({
  children,
  heightRatio = DEFAULT_SHEET_HEIGHT_RATIO,
  closeOnBackdropPress = false,
  onRequestClose,
  style,
  contentStyle,
}: ProductModalSheetProps) {
  const { theme, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const sheetTranslateY = useRef(
    new Animated.Value(SHEET_ENTRY_TRANSLATE_Y),
  ).current;
  const sheetOpacity = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const sheetHeight = useMemo(() => {
    const desiredHeight = Math.round(windowHeight * heightRatio);
    const maxHeight = windowHeight - insets.top - theme.spacing.lg;

    return Math.min(desiredHeight, maxHeight);
  }, [heightRatio, insets.top, theme.spacing.lg, windowHeight]);

  const styles = useMemo(
    () => createStyles(theme, isDark, insets.bottom, sheetHeight),
    [theme, isDark, insets.bottom, sheetHeight],
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(sheetOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropOpacity, sheetOpacity, sheetTranslateY]);

  return (
    <View style={styles.root}>
      <BlurView
        intensity={Platform.OS === "android" ? 72 : 34}
        tint={
          isDark
            ? "systemUltraThinMaterialDark"
            : "systemUltraThinMaterialLight"
        }
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        pointerEvents="none"
        style={[styles.backdropScrim, { opacity: backdropOpacity }]}
      />

      {closeOnBackdropPress ? (
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          onPress={onRequestClose}
        />
      ) : null}

      <Animated.View
        style={[
          styles.sheet,
          {
            opacity: sheetOpacity,
            transform: [{ translateY: sheetTranslateY }],
          },
          style,
        ]}
      >
        <View style={[styles.sheetContent, contentStyle]}>{children}</View>
      </Animated.View>
    </View>
  );
}

const createStyles = (
  theme: ThemeType,
  isDark: boolean,
  bottomInset: number,
  sheetHeight: number,
) => {
  const bottomSpacing = Math.max(bottomInset, theme.spacing.md);

  return StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: "flex-end",
      paddingHorizontal: SHEET_HORIZONTAL_MARGIN,
      paddingBottom: bottomSpacing,
      backgroundColor: "transparent",
    },

    backdropScrim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isDark ? "rgba(0,0,0,0.52)" : "rgba(0,0,0,0.18)",
    },

    sheet: {
      height: sheetHeight,
      overflow: "hidden",
      borderRadius: theme.borderRadius.lg + theme.spacing.sm,
      backgroundColor: theme.colors.background,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      shadowColor: theme.shadow.lg.shadowColor,
      shadowOffset: theme.shadow.lg.shadowOffset,
      shadowOpacity: isDark ? 0 : 0.18,
      shadowRadius: theme.shadow.lg.shadowRadius,
      elevation: isDark ? 0 : 10,
    },

    sheetContent: {
      flex: 1,
    },
  });
};