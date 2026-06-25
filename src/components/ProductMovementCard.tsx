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

const MOVEMENT_BADGE_ICON_SIZE = 15;
const MOVEMENT_SEGMENT_ICON_SIZE = 16;

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
  size={MOVEMENT_BADGE_ICON_SIZE}
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
            size={MOVEMENT_SEGMENT_ICON_SIZE}
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
            size={MOVEMENT_SEGMENT_ICON_SIZE}
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
  marginTop: theme.spacing.md,
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
  marginBottom: theme.spacing.sm + theme.spacing.xs,
  gap: theme.spacing.sm,
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

stockBadge: {
  minHeight: 30,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: theme.spacing.sm,
  borderRadius: theme.borderRadius.pill,
  backgroundColor: theme.colors.primarySubtle,
  gap: theme.spacing.xxs,
},

stockBadgeText: {
  color: theme.colors.primary,
  fontSize: theme.typography.caption1.fontSize,
  lineHeight: theme.typography.caption1.lineHeight,
  fontWeight: "800",
},

segmentedControl: {
  flexDirection: "row",
  gap: theme.spacing.sm,
  marginBottom: theme.spacing.sm + theme.spacing.xs,
},

segmentButton: {
  flex: 1,
  minHeight: 40,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
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
  fontSize: theme.typography.caption1.fontSize,
  lineHeight: theme.typography.caption1.lineHeight,
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
  marginBottom: theme.spacing.xs,
  marginLeft: theme.spacing.xs,
},

submitButton: {
  minHeight: 50,
  marginTop: 0,
  paddingVertical: theme.spacing.sm,
},
  });