import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { PRODUCT_FORM_DEFAULT_VALUES } from "../constants/productDefaults";
import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";
import type { ProdutoFormData } from "../schemas/produtoSchema";
import { produtoSchema } from "../schemas/produtoSchema";
import { Button } from "./Button";
import { CategorySelector } from "./CategorySelector";
import { CurrencyInput } from "./CurrencyInput";
import { ImagePickerField } from "./ImagePickerField";
import { Input } from "./Input";
import { IntegerInput } from "./IntegerInput";
import { UnitSelector } from "./UnitSelector";

type ProductFormProps = {
  initialValues?: ProdutoFormData;
  onSubmit: (data: ProdutoFormData) => void | Promise<void>;
  submitButtonText: string;
  disabled?: boolean;
  busyLabel?: string;
  headerComponent?: React.ReactNode;
};

export function ProductForm({
  initialValues,
  onSubmit,
  submitButtonText,
  disabled = false,
  busyLabel = "Processando...",
  headerComponent,
}: ProductFormProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: initialValues ?? PRODUCT_FORM_DEFAULT_VALUES,
  });

  const isBusy = disabled || isSubmitting;

const handleFormSubmit = (data: ProdutoFormData) => {
  Keyboard.dismiss();

  return onSubmit({
    ...data,
    foto:
      data.foto === null
        ? null
        : data.foto?.trim()
          ? data.foto
          : undefined,
  });
};

  return (
    <KeyboardAvoidingView
      style={styles.keyboardWrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <View style={styles.formWrapper}>
  <ScrollView
    style={styles.scrollView}
    contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps={isBusy ? "never" : "handled"}
    scrollEnabled={!isBusy}
  >
    <View pointerEvents={isBusy ? "none" : "auto"}>
      {headerComponent}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Imagem</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Foto do Produto</Text>

            <Controller
              control={control}
              name="foto"
              render={({ field: { onChange, value } }) => (
                <ImagePickerField
                  value={value}
                  onChange={onChange}
                  error={errors.foto?.message}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações básicas</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome do Produto</Text>

            <Controller
              control={control}
              name="nome"
              render={({ field: { onChange, value } }) => (
                <Input
                  icon="cube-outline"
                  placeholder="Ex: Teclado mecânico"
                  value={value}
                  onChangeText={onChange}
                  error={errors.nome?.message}
                  autoCapitalize="sentences"
                  returnKeyType="next"
                  accessibilityLabel="Nome do produto"
                />
              )}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Categoria</Text>

            <Controller
              control={control}
              name="categoriaId"
              render={({ field: { onChange, value } }) => (
                <CategorySelector
                  value={value}
                  onChange={onChange}
                  error={errors.categoriaId?.message}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estoque</Text>

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Quantidade</Text>

              <Controller
                control={control}
                name="quantidade"
                render={({ field: { onChange, value } }) => (
                  <IntegerInput
                    icon="layers-outline"
                    placeholder="0"
                    value={value}
                    onChangeValue={onChange}
                    error={errors.quantidade?.message}
                    returnKeyType="next"
                    accessibilityLabel="Quantidade em estoque"
                  />
                )}
              />
            </View>

            <View style={styles.rowItem}>
              <Text style={styles.label}>Qtd. Mínima</Text>

              <Controller
                control={control}
                name="quantidadeMinima"
                render={({ field: { onChange, value } }) => (
                  <IntegerInput
                    icon="alert-circle-outline"
                    placeholder="0"
                    value={value}
                    onChangeValue={onChange}
                    error={errors.quantidadeMinima?.message}
                    returnKeyType="next"
                    accessibilityLabel="Quantidade mínima"
                  />
                )}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comercial</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Preço</Text>

            <Controller
              control={control}
              name="preco"
              render={({ field: { onChange, value } }) => (
                <CurrencyInput
                  icon="cash-outline"
                  value={value}
                  onChangeValue={onChange}
                  error={errors.preco?.message}
                  returnKeyType="next"
                  accessibilityLabel="Preço do produto"
                />
              )}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Unidade</Text>

            <Controller
              control={control}
              name="unidade"
              render={({ field: { onChange, value } }) => (
                <UnitSelector
                  value={value}
                  onChange={onChange}
                  error={errors.unidade?.message}
                />
              )}
            />
          </View>
        </View>

        <Button
          title={submitButtonText}
        onPress={handleSubmit(handleFormSubmit)}
        fullWidth
        loading={isSubmitting}
        disabled={isBusy}
        style={styles.submitButton}
        />
        </View>
      </ScrollView>

      {isBusy && (
    <View style={styles.interactionBlocker} pointerEvents="auto">
      <View style={styles.busyIndicator}>
        <ActivityIndicator color={theme.colors.primary} />

        <Text style={styles.busyText}>
          {isSubmitting ? "Salvando..." : busyLabel}
        </Text>
      </View>
    </View>
  )}
</View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    keyboardWrapper: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    scrollView: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    container: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: 72,
      backgroundColor: theme.colors.background,
    },

    section: {
      marginBottom: theme.spacing.lg,
    },

    sectionTitle: {
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "700",
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: theme.spacing.sm + theme.spacing.xs,
      marginLeft: theme.spacing.xs,
    },

    formGroup: {
      marginBottom: theme.spacing.sm,
    },

    label: {
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      fontWeight: "700",
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      marginLeft: theme.spacing.xs,
    },

    row: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },

    rowItem: {
      flex: 1,
    },

    submitButton: {
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
    },

    formWrapper: {
  flex: 1,
},

interactionBlocker: {
  ...StyleSheet.absoluteFillObject,
  justifyContent: "center",
  alignItems: "center",
},

busyIndicator: {
  minHeight: 44,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: theme.spacing.md,
  borderRadius: theme.borderRadius.pill,
  backgroundColor: theme.colors.surfaceElevated,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: theme.colors.separator,
  shadowColor: theme.shadow.sm.shadowColor,
  shadowOffset: theme.shadow.sm.shadowOffset,
  shadowOpacity: theme.shadow.sm.shadowOpacity,
  shadowRadius: theme.shadow.sm.shadowRadius,
  elevation: theme.shadow.sm.elevation,
  gap: theme.spacing.sm,
},

busyText: {
  color: theme.colors.text,
  fontSize: theme.typography.footnote.fontSize,
  lineHeight: theme.typography.footnote.lineHeight,
  fontWeight: "700",
},
  });
