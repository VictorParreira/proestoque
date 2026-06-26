import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";
import { ProductListItemSkeleton } from "./ProductListItemSkeleton";
import { Skeleton } from "./Skeleton";
import { SummaryCardSkeleton } from "./SummaryCardSkeleton";

const SUMMARY_SKELETON_ITEMS = [0, 1, 2, 3];
const PRODUCT_SKELETON_ITEMS = [0, 1, 2];

export function DashboardSkeleton() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      accessibilityRole="progressbar"
      accessibilityLabel="Carregando dashboard"
    >
      <View style={styles.greetingContainer}>
        <View style={styles.greetingTextContainer}>
          <Skeleton
            width="34%"
            height={16}
            borderRadius={theme.borderRadius.pill}
          />

          <Skeleton
            width="48%"
            height={29}
            borderRadius={theme.borderRadius.sm}
            style={styles.nameSkeleton}
          />

          <Skeleton
            width="56%"
            height={12}
            borderRadius={theme.borderRadius.pill}
            style={styles.dateSkeleton}
          />
        </View>

        <Skeleton
          width={42}
          height={42}
          borderRadius={theme.borderRadius.pill}
        />
      </View>

      <View style={styles.cardsGrid}>
        {SUMMARY_SKELETON_ITEMS.map((item) => (
          <SummaryCardSkeleton key={item} style={styles.summaryCard} />
        ))}
      </View>

      <View style={styles.alertCard}>
        <View style={styles.alertHeader}>
          <Skeleton
            width={32}
            height={32}
            borderRadius={theme.borderRadius.pill}
          />

          <View style={styles.alertTextContainer}>
            <Skeleton
              width="48%"
              height={14}
              borderRadius={theme.borderRadius.pill}
            />

            <Skeleton
              width="68%"
              height={12}
              borderRadius={theme.borderRadius.pill}
              style={styles.alertSubtitle}
            />
          </View>
        </View>

        <Skeleton
          width="100%"
          height={1}
          borderRadius={theme.borderRadius.pill}
          style={styles.alertDivider}
        />

        <Skeleton
          width="74%"
          height={12}
          borderRadius={theme.borderRadius.pill}
        />
      </View>

      <Skeleton
        width="42%"
        height={13}
        borderRadius={theme.borderRadius.pill}
        style={styles.sectionTitle}
      />

      {PRODUCT_SKELETON_ITEMS.map((item) => (
        <ProductListItemSkeleton
          key={item}
          showStatus
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
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xs,
      paddingBottom: 148,
    },

    greetingContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },

    greetingTextContainer: {
      flex: 1,
      marginRight: theme.spacing.md,
    },

    nameSkeleton: {
      marginTop: theme.spacing.xxs,
    },

    dateSkeleton: {
      marginTop: theme.spacing.xxs,
    },

    cardsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
    },

    summaryCard: {
      width: "48%",
      marginBottom: theme.spacing.sm + theme.spacing.xs,
    },

    alertCard: {
      marginBottom: theme.spacing.lg,
      padding: theme.spacing.md,
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

    alertHeader: {
      flexDirection: "row",
      alignItems: "center",
    },

    alertTextContainer: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },

    alertSubtitle: {
      marginTop: theme.spacing.xs,
    },

    alertDivider: {
      marginVertical: theme.spacing.md,
    },

    sectionTitle: {
      marginBottom: theme.spacing.sm,
      marginLeft: theme.spacing.xs,
    },

    productListItem: {
      marginBottom: theme.spacing.sm,
    },
  });