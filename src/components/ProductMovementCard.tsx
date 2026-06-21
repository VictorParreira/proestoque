import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { ThemeType } from "../constants/theme";
import type {
  MovimentacaoProdutoData,
} from "../contexts/ProductsContext";
import { useAppTheme } from "../contexts/ThemeContext";
import type { Produto } from "../domain/produtos";
import { Button } from "./Button";
import { Input } from "./Input";
import { IntegerInput } from "./IntegerInput";

type TipoMovimentacao = MovimentacaoProdutoData["tipo"];

type ProductMovementCardProps = {
  product: Produto;
  disabled?: boolean;
  onSubmit: (data: MovimentacaoProdutoData) => Promise<void>;
  style?: View["props"]["style"];
};

export function ProductMovementCard({
  product,
  disabled = false,
  onSubmit,
  style,
}: ProductMovementCardProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [tipo, setTipo] = useState<TipoMovimentacao>("entrada");
  const [quantidade, setQuantidade] = useState(0);
  const [observacao, setObservacao] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isBusy = disabled || isSubmitting;
  const isEntrada = tipo === "entrada";
  const submitLabel = isEntrada ? "Registrar entrada" : "Registrar saída";

  const handleSubmit = async () => {
    if (isBusy) return;

    if (quantidade <= 0) {
      setLocalError("Informe uma quantidade maior que zero.");
      return;
    }

    setLocalError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        tipo,
        quantidade,
        observacao: observacao.trim() || undefined,
      });

      setQuantidade(0);
      setObservacao("");
      setTipo("entrada");
    } catch {
      // O alerta de erro é exibido pela tela que chama o card.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, style, isBusy && styles.containerDisabled]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Movimentação de estoque</Text>
          <Text style={styles.subtitle}>
            Estoque atual: {product.quantidade} {product.unidade}
          </Text>
        </View>

        <View style={styles.stockBadge}>
          <Ionicons
            name="cube-outline"
            size={16}
            color={theme.colors.primary}
          />
          <Text style={styles.stockBadgeText}>{product.quantidade}</Text>
        </View>
      </View>

      <View style={styles.segmentedControl}>
        <TouchableOpacity
          activeOpacity={0.72}
          accessibilityRole="button"
          accessibilityLabel="Selecionar entrada de estoque"
          accessibilityState={{ selected: isEntrada, disabled: isBusy }}
          disabled={isBusy}
          onPress={() => setTipo("entrada")}
          style={[
            styles.segmentButton,
            isEntrada && styles.segmentButtonEntradaSelected,
          ]}
        >
          <Ionicons
            name="arrow-down-circle-outline"
            size={18}
            color={isEntrada ? theme.colors.primary : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.segmentText,
              isEntrada && styles.segmentTextEntradaSelected,
            ]}
          >
            Entrada
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.72}
          accessibilityRole="button"
          accessibilityLabel="Selecionar saída de estoque"
          accessibilityState={{ selected: !isEntrada, disabled: isBusy }}
          disabled={isBusy}
          onPress={() => setTipo("saida")}
          style={[
            styles.segmentButton,
            !isEntrada && styles.segmentButtonSaidaSelected,
          ]}
        >
          <Ionicons
            name="arrow-up-circle-outline"
            size={18}
            color={!isEntrada ? theme.colors.error : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.segmentText,
              !isEntrada && styles.segmentTextSaidaSelected,
            ]}
          >
            Saída
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Quantidade</Text>

      <IntegerInput
        icon="layers-outline"
        value={quantidade}
        onChangeValue={(value) => {
          setQuantidade(value);
          setLocalError(null);
        }}
        error={localError ?? undefined}
        editable={!isBusy}
        accessibilityLabel="Quantidade da movimentação"
        placeholder="0"
        returnKeyType="next"
      />

      <Text style={styles.label}>Observação</Text>

      <Input
        icon="document-text-outline"
        value={observacao}
        onChangeText={setObservacao}
        editable={!isBusy}
        accessibilityLabel="Observação da movimentação"
        placeholder="Opcional"
        returnKeyType="done"
      />

      <Button
        title={submitLabel}
        onPress={() => {
          void handleSubmit();
        }}
        loading={isSubmitting}
        disabled={isBusy}
        fullWidth
        variant={isEntrada ? "solid" : "destructive"}
        style={styles.submitButton}
      />
    </View>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },

    containerDisabled: {
      opacity: 0.92,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.spacing.md,
      gap: theme.spacing.md,
    },

    title: {
      color: theme.colors.text,
      fontSize: theme.typography.headline.fontSize,
      lineHeight: theme.typography.headline.lineHeight,
      fontWeight: theme.typography.headline.fontWeight,
    },

    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "600",
      marginTop: theme.spacing.xs,
    },

    stockBadge: {
      minHeight: 36,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.primarySubtle,
      gap: theme.spacing.xs,
    },

    stockBadgeText: {
      color: theme.colors.primary,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "800",
    },

    segmentedControl: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },

    segmentButton: {
      flex: 1,
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.inputBackground,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      gap: theme.spacing.xs,
    },

    segmentButtonEntradaSelected: {
      backgroundColor: theme.colors.primarySubtle,
      borderColor: theme.colors.primary,
    },

    segmentButtonSaidaSelected: {
      backgroundColor: theme.colors.errorSoft,
      borderColor: theme.colors.error,
    },

    segmentText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "700",
    },

    segmentTextEntradaSelected: {
      color: theme.colors.primary,
    },

    segmentTextSaidaSelected: {
      color: theme.colors.error,
    },

    label: {
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "700",
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      marginLeft: theme.spacing.xs,
    },

    submitButton: {
      marginTop: theme.spacing.xs,
    },
  });