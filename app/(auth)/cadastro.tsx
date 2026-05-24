import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../../src/components/Button";
import { Input } from "../../src/components/Input";
import { LogoProEstoque } from "../../src/components/LogoProEstoque";
import type { ThemeType } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";
import { useAppTheme } from "../../src/contexts/ThemeContext";

type CadastroErrors = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const INITIAL_ERRORS: CadastroErrors = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Cadastro() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { theme } = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<CadastroErrors>(INITIAL_ERRORS);

  const handleCadastro = async () => {
    const newError: CadastroErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    let hasError = false;

    if (!name.trim()) {
      newError.name = "O nome é obrigatório";
      hasError = true;
    }

    if (!email.trim()) {
      newError.email = "O e-mail é obrigatório";
      hasError = true;
    }

    if (!password.trim()) {
      newError.password = "A senha é obrigatória";
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      newError.confirmPassword = "Confirme sua senha";
      hasError = true;
    } else if (password !== confirmPassword) {
      newError.confirmPassword = "As senhas não coincidem";
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    setError(INITIAL_ERRORS);

    await login(name.trim(), email.trim());
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <LogoProEstoque size="md" />

            <Text style={styles.title}>Crie sua conta</Text>

            <Text style={styles.subtitle}>
              Comece a gerenciar produtos, estoque e alertas em poucos minutos.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome completo</Text>

              <Input
                icon="person-outline"
                placeholder="Seu nome completo"
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
                error={error.name}
                editable={!isLoading}
                accessibilityLabel="Nome completo"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>

              <Input
                icon="mail-outline"
                placeholder="Seu melhor e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                error={error.email}
                editable={!isLoading}
                accessibilityLabel="E-mail"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>

              <Input
                icon="lock-closed-outline"
                placeholder="Crie uma senha forte"
                isPassword
                value={password}
                onChangeText={setPassword}
                error={error.password}
                editable={!isLoading}
                accessibilityLabel="Senha"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar senha</Text>

              <Input
                icon="checkmark-circle-outline"
                placeholder="Repita sua senha"
                isPassword
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={error.confirmPassword}
                editable={!isLoading}
                accessibilityLabel="Confirmar senha"
              />
            </View>

            <Button
              title="Finalizar cadastro"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              onPress={handleCadastro}
              style={styles.submitButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já possui uma conta? </Text>

            <TouchableOpacity
              onPress={() => router.replace("/(auth)/login")}
              disabled={isLoading}
              activeOpacity={0.72}
              accessibilityRole="button"
              accessibilityLabel="Entrar na conta"
            >
              <Text style={[styles.linkText, isLoading && styles.disabledText]}>
                Entrar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    keyboardView: {
      flex: 1,
    },

    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.lg,
    },

    header: {
      alignItems: "center",
      marginBottom: theme.spacing.xl,
    },

    title: {
      marginTop: theme.spacing.lg,
      color: theme.colors.text,
      fontSize: theme.typography.title1.fontSize,
      lineHeight: theme.typography.title1.lineHeight,
      fontWeight: theme.typography.title1.fontWeight,
      letterSpacing: -0.5,
      textAlign: "center",
    },

    subtitle: {
      marginTop: theme.spacing.xs,
      maxWidth: 320,
      color: theme.colors.textSecondary,
      fontSize: theme.typography.subheadline.fontSize,
      lineHeight: theme.typography.subheadline.lineHeight,
      fontWeight: "500",
      textAlign: "center",
    },

    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      shadowColor: theme.shadow.md.shadowColor,
      shadowOffset: theme.shadow.md.shadowOffset,
      shadowOpacity: theme.shadow.md.shadowOpacity,
      shadowRadius: theme.shadow.md.shadowRadius,
      elevation: theme.shadow.md.elevation,
    },

    inputGroup: {
      marginBottom: 0,
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
      marginTop: theme.spacing.md,
    },

    footer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.md,
    },

    footerText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.subheadline.fontSize,
      lineHeight: theme.typography.subheadline.lineHeight,
      fontWeight: "500",
    },

    linkText: {
      color: theme.colors.primary,
      fontWeight: "800",
      fontSize: theme.typography.subheadline.fontSize,
      lineHeight: theme.typography.subheadline.lineHeight,
    },

    disabledText: {
      opacity: theme.opacity.disabled,
    },
  });
