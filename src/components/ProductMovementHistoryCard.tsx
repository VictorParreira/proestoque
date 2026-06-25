import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";
import type { ProductMovement } from "../hooks/useProductMovements";

type ProductMovementHistoryCardProps = {
  movements: ProductMovement[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
};

const MAX_VISIBLE_MOVEMENTS = 5;
const HISTORY_COUNT_BADGE_SIZE = 30;
const HISTORY_ITEM_ICON_SIZE = 18;
const HISTORY_ITEM_ICON_WRAPPER_SIZE = 30;

const formatMovementDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export function ProductMovementHistoryCard({
  movements,
  isLoading = false,
  error,
  onRetry,
  style,
}: ProductMovementHistoryCardProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const visibleMovements = movements.slice(0, MAX_VISIBLE_MOVEMENTS);
  const isEmpty = !isLoading && !error && visibleMovements.length === 0;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
  <View style={styles.headerTextContent}>
    <Text style={styles.title} numberOfLines={2}>
      Histórico de movimentações
    </Text>

    <Text style={styles.subtitle} numberOfLines={2}>
  Últimas entradas e saídas registradas para este produto.
</Text>
  </View>

  <View style={styles.headerAccessory}>
    {isLoading ? (
      <ActivityIndicator color={theme.colors.primary} />
    ) : (
      <View style={styles.countBadge}>
        <Text style={styles.countBadgeText}>{movements.length}</Text>
      </View>
    )}
  </View>
</View>

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color={theme.colors.error}
          />

          <Text style={styles.errorText}>{error}</Text>

          {onRetry ? (
            <TouchableOpacity
              activeOpacity={0.72}
              accessibilityRole="button"
              accessibilityLabel="Tentar carregar histórico novamente"
              onPress={onRetry}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {isEmpty ? (
        <View style={styles.emptyBox}>
          <Ionicons
            name="time-outline"
            size={22}
            color={theme.colors.textSecondary}
          />

          <Text style={styles.emptyText}>
            Nenhuma entrada ou saída registrada ainda.
          </Text>
        </View>
      ) : null}

      {visibleMovements.map((movement) => {
        const isEntrada = movement.tipo === "entrada";
        const signal = isEntrada ? "+" : "-";
        const color = isEntrada ? theme.colors.primary : theme.colors.error;

        return (
          <View key={movement.id} style={styles.item}>
            <View style={[styles.iconWrapper, { borderColor: color }]}>
              <Ionicons
  name={
    isEntrada
      ? "arrow-down-circle-outline"
      : "arrow-up-circle-outline"
  }
  size={HISTORY_ITEM_ICON_SIZE}
  color={color}
/>
            </View>

            <View style={styles.itemContent}>
              <View style={styles.itemTopRow}>
                <Text style={styles.itemTitle}>
                  {isEntrada ? "Entrada" : "Saída"}
                </Text>

                <View style={styles.itemQuantityWrapper}>
  <Text style={[styles.itemQuantity, { color }]}>
    {signal}
    {movement.quantidade}
  </Text>
</View>
              </View>

              <Text style={styles.itemDate}>
                {formatMovementDate(movement.criadaEm)}
              </Text>

              {movement.observacao ? (
                <Text style={styles.itemObservation} numberOfLines={1}>
  {movement.observacao}
</Text>
              ) : null}
            </View>
          </View>
        );
      })}
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
  overflow: "hidden",
},

header: {
  flexDirection: "row",
  alignItems: "flex-start",
  marginBottom: theme.spacing.sm + theme.spacing.xs,
  gap: theme.spacing.sm,
},

headerTextContent: {
  flex: 1,
  minWidth: 0,
},

headerAccessory: {
  flexShrink: 0,
  width: HISTORY_COUNT_BADGE_SIZE,
  minHeight: HISTORY_COUNT_BADGE_SIZE,
  alignItems: "center",
  justifyContent: "center",
},

title: {
  color: theme.colors.text,
  fontSize: theme.typography.subheadline.fontSize,
  lineHeight: theme.typography.subheadline.lineHeight,
  fontWeight: "800",
},

subtitle: {
  color: theme.colors.textSecondary,
  fontSize: theme.typography.caption1.fontSize,
  lineHeight: theme.typography.caption1.lineHeight,
  fontWeight: "600",
  marginTop: theme.spacing.xxs,
},

countBadge: {
  width: HISTORY_COUNT_BADGE_SIZE,
  height: HISTORY_COUNT_BADGE_SIZE,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: theme.borderRadius.pill,
  backgroundColor: theme.colors.primarySubtle,
},

countBadgeText: {
  color: theme.colors.primary,
  fontSize: theme.typography.caption1.fontSize,
  lineHeight: theme.typography.caption1.lineHeight,
  fontWeight: "800",
},

    errorBox: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.errorSoft,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.error,
      gap: theme.spacing.sm,
    },

    errorText: {
      flex: 1,
      color: theme.colors.error,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "600",
    },

    retryButton: {
      minHeight: 30,
      justifyContent: "center",
      paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.error,
    },

    retryButtonText: {
      color: theme.colors.primaryContrast,
      fontSize: theme.typography.caption1.fontSize,
      lineHeight: theme.typography.caption1.lineHeight,
      fontWeight: "700",
    },

emptyBox: {
  minHeight: 48,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 0,
  paddingTop: theme.spacing.xxs,
  gap: theme.spacing.sm,
},

    emptyText: {
      flex: 1,
      color: theme.colors.textSecondary,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "600",
    },

item: {
  flexDirection: "row",
  paddingVertical: theme.spacing.sm,
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: theme.colors.separator,
  gap: theme.spacing.sm,
},

iconWrapper: {
  width: HISTORY_ITEM_ICON_WRAPPER_SIZE,
  height: HISTORY_ITEM_ICON_WRAPPER_SIZE,
  borderRadius: theme.borderRadius.pill,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: StyleSheet.hairlineWidth,
  backgroundColor: theme.colors.inputBackground,
},

    itemContent: {
      flex: 1,
    },

    itemTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing.sm,
    },

itemTitle: {
  flex: 1,
  color: theme.colors.text,
  fontSize: theme.typography.footnote.fontSize,
  lineHeight: theme.typography.footnote.lineHeight,
  fontWeight: "800",
},

itemQuantity: {
  minWidth: 34,
  fontSize: theme.typography.footnote.fontSize,
  lineHeight: theme.typography.footnote.lineHeight,
  fontWeight: "800",
  textAlign: "center",
},

itemDate: {
  color: theme.colors.textSecondary,
  fontSize: theme.typography.caption1.fontSize,
  lineHeight: theme.typography.caption1.lineHeight,
  fontWeight: "600",
  marginTop: theme.spacing.xxs,
},

itemObservation: {
  color: theme.colors.textSecondary,
  fontSize: theme.typography.caption1.fontSize,
  lineHeight: theme.typography.caption1.lineHeight,
  marginTop: theme.spacing.xxs,
},

itemQuantityWrapper: {
  width: 38,
  alignItems: "center",
  justifyContent: "center",
},
  });