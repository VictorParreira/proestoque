import React, { useMemo } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";
import { Skeleton } from "./Skeleton";

type ProductListItemSkeletonProps = ViewProps & {
  showStatus?: boolean;
  showChevron?: boolean;
};

const PRODUCT_MEDIA_SIZE = 44;

export function ProductListItemSkeleton({
  showStatus = true,
  showChevron = false,
  style,
  ...rest
}: ProductListItemSkeletonProps) {
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
      <View style={styles.productInfo}>
        <Skeleton
          width={PRODUCT_MEDIA_SIZE}
          height={PRODUCT_MEDIA_SIZE}
          borderRadius={theme.borderRadius.sm}
          style={styles.media}
        />

        <View style={styles.textContainer}>
          <Skeleton
            width="62%"
            height={14}
            borderRadius={theme.borderRadius.pill}
            style={styles.name}
          />

          <Skeleton
            width="46%"
            height={12}
            borderRadius={theme.borderRadius.pill}
          />
        </View>
      </View>

      {showStatus ? (
        <Skeleton
          width={58}
          height={24}
          borderRadius={theme.borderRadius.pill}
        />
      ) : null}

      {!showStatus && showChevron ? (
        <Skeleton
          width={18}
          height={18}
          borderRadius={theme.borderRadius.pill}
        />
      ) : null}
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.sm + theme.spacing.xxs,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      shadowColor: theme.shadow.sm.shadowColor,
      shadowOffset: theme.shadow.sm.shadowOffset,
      shadowOpacity: theme.shadow.sm.shadowOpacity,
      shadowRadius: theme.shadow.sm.shadowRadius,
      elevation: theme.shadow.sm.elevation,
    },

    productInfo: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },

    media: {
      marginRight: theme.spacing.sm + theme.spacing.xxs,
    },

    textContainer: {
      flex: 1,
      paddingRight: theme.spacing.xs,
    },

    name: {
      marginBottom: theme.spacing.xs,
    },
  });