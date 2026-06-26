import React, { useMemo } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";
import { Skeleton } from "./Skeleton";

const ICON_CONTAINER_SIZE = 32;

export function SummaryCardSkeleton({ style, ...rest }: ViewProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View
      style={[styles.container, style]}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      {...rest}
    >
      <View style={styles.header}>
        <Skeleton
          width="58%"
          height={12}
          borderRadius={theme.borderRadius.pill}
        />

        <Skeleton
          width={ICON_CONTAINER_SIZE}
          height={ICON_CONTAINER_SIZE}
          borderRadius={theme.borderRadius.pill}
        />
      </View>

      <Skeleton width="44%" height={28} borderRadius={theme.borderRadius.sm} />
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm + theme.spacing.xs,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      shadowColor: theme.shadow.sm.shadowColor,
      shadowOffset: theme.shadow.sm.shadowOffset,
      shadowOpacity: theme.shadow.sm.shadowOpacity,
      shadowRadius: theme.shadow.sm.shadowRadius,
      elevation: theme.shadow.sm.elevation,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
  });