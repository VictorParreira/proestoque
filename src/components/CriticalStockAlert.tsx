import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type ViewProps,
} from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";
import type { Produto } from "../domain/produtos";

type CriticalStockAlertProps = ViewProps & {
  items: Produto[];
  maxVisibleItems?: number;
};

export function CriticalStockAlert({
  items,
  maxVisibleItems = 5,
  style,
  ...rest
}: CriticalStockAlertProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [isExpanded, setIsExpanded] = useState(false);

  const visibleItems = useMemo(() => {
    return isExpanded ? items : items.slice(0, maxVisibleItems);
  }, [isExpanded, items, maxVisibleItems]);

  if (items.length === 0) {
    return null;
  }

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="summary"
      accessibilityLabel={`${items.length} itens com estoque crítico`}
      {...rest}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={20}
            color={theme.colors.error}
          />
        </View>

        <Text style={styles.title}>Estoque Crítico</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{items.length}</Text>
        </View>
      </View>

      <View style={styles.list}>
        {visibleItems.map((item) => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.nome}
            </Text>

            <Text style={styles.quantity}>
              {item.quantidade} / {item.quantidadeMinima}
            </Text>
          </View>
        ))}
      </View>

      {items.length > maxVisibleItems && (
        <TouchableOpacity
          style={styles.toggleButton}
          activeOpacity={0.72}
          onPress={() => setIsExpanded((current) => !current)}
          accessibilityRole="button"
          accessibilityLabel={
            isExpanded
              ? "Recolher lista de estoque crítico"
              : `Visualizar todos os ${items.length} itens com estoque crítico`
          }
        >
          <Text style={styles.toggleText}>
            {isExpanded
              ? "Recolher lista"
              : `Visualizar todos os ${items.length} itens`}
          </Text>

          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
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
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },

    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: theme.borderRadius.pill,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.errorSoft,
    },

    title: {
      flex: 1,
      marginLeft: theme.spacing.sm,
      color: theme.colors.text,
      fontSize: theme.typography.callout.fontSize,
      lineHeight: theme.typography.callout.lineHeight,
      fontWeight: "700",
    },

    badge: {
      backgroundColor: theme.colors.errorSoft,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xxs,
      borderRadius: theme.borderRadius.sm,
    },

    badgeText: {
      color: theme.colors.error,
      fontWeight: "800",
      fontSize: theme.typography.caption1.fontSize,
      lineHeight: theme.typography.caption1.lineHeight,
    },

    list: {
      gap: theme.spacing.sm,
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.backgroundSecondary,
      padding: theme.spacing.sm + theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
    },

    itemName: {
      flex: 1,
      marginRight: theme.spacing.sm + theme.spacing.xs,
      color: theme.colors.text,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "600",
    },

    quantity: {
      color: theme.colors.error,
      fontWeight: "700",
      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
    },

    toggleButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.separator,
      gap: theme.spacing.xs,
    },

    toggleText: {
      color: theme.colors.primary,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "700",
    },
  });
