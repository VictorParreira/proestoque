import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    type TouchableOpacityProps,
    View,
} from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";
import { formatarPreco, type Produto } from "../domain/produtos";
import { StatusBadge } from "./StatusBadge";

type ProductStatus = {
  label: string;
  variant: "success" | "warning" | "error";
};

type ProductListItemProps = Omit<TouchableOpacityProps, "children"> & {
  product: Produto;
  showStatus?: boolean;
  showChevron?: boolean;
};

function getProductStatus(product: Produto): ProductStatus {
  if (product.quantidade === 0) {
    return {
      label: "Vazio",
      variant: "error",
    };
  }

  if (product.quantidade < product.quantidadeMinima) {
    return {
      label: "Baixo",
      variant: "warning",
    };
  }

  return {
    label: "Normal",
    variant: "success",
  };
}

export function ProductListItem({
  product,
  showStatus = true,
  showChevron = false,
  style,
  disabled,
  onPress,
  activeOpacity = 0.72,
  accessibilityLabel,
  ...rest
}: ProductListItemProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const status = getProductStatus(product);
  const isInteractive = Boolean(onPress) && !disabled;

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      disabled={disabled || !onPress}
      onPress={onPress}
      accessibilityRole={isInteractive ? "button" : undefined}
      accessibilityLabel={
        accessibilityLabel ??
        `${product.nome}, ${product.quantidade} ${product.unidade}, ${formatarPreco(
          product.preco,
        )}`
      }
      style={[styles.container, style]}
      {...rest}
    >
      <View style={styles.productInfo}>
        {product.foto ? (
          <Image
            source={{ uri: product.foto }}
            style={styles.thumbnail}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={styles.iconContainer}>
            <Ionicons
              name="cube-outline"
              size={22}
              color={theme.colors.primary}
            />
          </View>
        )}

        <View style={styles.textContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {product.nome}
          </Text>

          <Text style={styles.meta} numberOfLines={1}>
            {product.quantidade} {product.unidade} •{" "}
            {formatarPreco(product.preco)}
          </Text>
        </View>
      </View>

      {showStatus && (
        <StatusBadge label={status.label} variant={status.variant} />
      )}

      {!showStatus && showChevron && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.colors.textTertiary}
        />
      )}
    </TouchableOpacity>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      paddingVertical: theme.spacing.sm + theme.spacing.xs,
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

    thumbnail: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.sm + theme.spacing.xs,
      backgroundColor: theme.colors.backgroundSecondary,
    },

    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.primarySubtle,
      justifyContent: "center",
      alignItems: "center",
      marginRight: theme.spacing.sm + theme.spacing.xs,
    },

    textContainer: {
      flex: 1,
      paddingRight: theme.spacing.sm,
    },

    name: {
      color: theme.colors.text,
      fontSize: theme.typography.subheadline.fontSize,
      lineHeight: theme.typography.subheadline.lineHeight,
      fontWeight: "700",
      marginBottom: 2,
    },

    meta: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "500",
    },
  });
