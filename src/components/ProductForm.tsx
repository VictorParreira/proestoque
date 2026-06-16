import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { ThemeType } from "../constants/theme";
import { useAppTheme } from "../contexts/ThemeContext";
import type { ProdutoFormData } from "../schemas/produtoSchema";
import { produtoSchema } from "../schemas/produtoSchema";
import { Button } from "./Button";
import { CategorySelector } from "./CategorySelector";
import { ImagePickerField } from "./ImagePickerField";
import { Input } from "./Input";

type ProductFormProps = {
  initialValues?: ProdutoFormData;
  onSubmit: (data: ProdutoFormData) => void;
  submitButtonText: string;
};

export function ProductForm({
  initialValues,
  onSubmit,
  submitButtonText,
}: ProductFormProps) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: initialValues || {
      nome: "",
      categoriaId: "cat_1",
      quantidade: 0,
      quantidadeMinima: 0,
      preco: 0,
      unidade: "un",
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.keyboardWrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
                  <Input
                    icon="layers-outline"
                    placeholder="0"
                    keyboardType="numeric"
                    value={value === 0 ? "" : String(value)}
                    onChangeText={(val) => {
                      const num = parseInt(val.replace(/[^0-9]/g, ""), 10);
                      onChange(Number.isNaN(num) ? 0 : num);
                    }}
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
                  <Input
                    icon="alert-circle-outline"
                    placeholder="0"
                    keyboardType="numeric"
                    value={value === 0 ? "" : String(value)}
                    onChangeText={(val) => {
                      const num = parseInt(val.replace(/[^0-9]/g, ""), 10);
                      onChange(Number.isNaN(num) ? 0 : num);
                    }}
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

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Preço</Text>

              <Controller
                control={control}
                name="preco"
                render={({ field: { onChange, value } }) => (
                  <Input
                    icon="cash-outline"
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    value={value === 0 ? "" : String(value)}
                    onChangeText={(val) => {
                      const normalizedValue = val.replace(/,/g, ".");
                      const num = parseFloat(normalizedValue);
                      onChange(Number.isNaN(num) ? 0 : num);
                    }}
                    error={errors.preco?.message}
                    returnKeyType="next"
                    accessibilityLabel="Preço do produto"
                  />
                )}
              />
            </View>

            <View style={styles.rowItem}>
              <Text style={styles.label}>Unidade</Text>

              <Controller
                control={control}
                name="unidade"
                render={({ field: { onChange, value } }) => (
                  <Input
                    icon="scale-outline"
                    placeholder="Ex: un, kg, cx"
                    value={value}
                    onChangeText={onChange}
                    error={errors.unidade?.message}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    accessibilityLabel="Unidade do produto"
                  />
                )}
              />
            </View>
          </View>
        </View>

        <Button
          title={submitButtonText}
          onPress={handleSubmit(onSubmit)}
          fullWidth
          loading={isSubmitting}
          style={styles.submitButton}
        />
      </ScrollView>
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
  });
