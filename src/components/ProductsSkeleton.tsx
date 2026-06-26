import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";
import { ProductListItemSkeleton } from "./ProductListItemSkeleton";
import { Skeleton } from "./Skeleton";

const CATEGORY_SKELETON_ITEMS = [0, 1, 2, 3];
const PRODUCT_SKELETON_ITEMS = [0, 1, 2, 3, 4, 5];

export function ProductsSkeleton() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      accessibilityRole="progressbar"
      accessibilityLabel="Carregando produtos"
    >
      <View style={styles.titleRow}>
        <Skeleton
          width="42%"
          height={36}
          borderRadius={theme.borderRadius.sm}
        />

        <View style={styles.viewModeSkeleton}>
          <Skeleton
            width={30}
            height={30}
            borderRadius={theme.borderRadius.pill}
          />
          <Skeleton
            width={30}
            height={30}
            borderRadius={theme.borderRadius.pill}
          />
          <Skeleton
            width={30}
            height={30}
            borderRadius={theme.borderRadius.pill}
          />
        </View>
      </View>

      <View style={styles.searchSkeleton}>
        <Skeleton
          width={18}
          height={18}
          borderRadius={theme.borderRadius.pill}
        />

        <Skeleton
          width="44%"
          height={14}
          borderRadius={theme.borderRadius.pill}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORY_SKELETON_ITEMS.map((item) => (
          <Skeleton
            key={item}
            width={item === 0 ? 74 : 96}
            height={36}
            borderRadius={theme.borderRadius.pill}
          />
        ))}
      </ScrollView>

      {PRODUCT_SKELETON_ITEMS.map((item) => (
        <ProductListItemSkeleton
          key={item}
          showStatus={false}
          showChevron
          style={styles.productListItem}
        />
      ))}
    </ScrollView>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    content: {
      flexGrow: 1,
      paddingTop: theme.spacing.xs,
      paddingBottom: 148,
    },

    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm + theme.spacing.xs,
      paddingHorizontal: theme.spacing.lg,
    },

    viewModeSkeleton: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      padding: theme.spacing.xxs,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },

    searchSkeleton: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm + theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },

    categoriesScroll: {
      marginBottom: theme.spacing.sm + theme.spacing.xs,
    },

    categoriesContent: {
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      paddingRight: theme.spacing.xl,
    },

    productListItem: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
  });