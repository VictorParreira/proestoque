import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthCard } from "../../src/components/auth/AuthCard";
import { AuthFormField } from "../../src/components/auth/AuthFormField";
import { AuthHeader } from "../../src/components/auth/AuthHeader";
import { AuthLinkFooter } from "../../src/components/auth/AuthLinkFooter";
import { Button } from "../../src/components/Button";
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
          <AuthHeader
            title="Crie sua conta"
            description="Comece a gerenciar produtos, estoque e alertas em poucos minutos."
            logoSize="md"
          />

          <AuthCard>
            <AuthFormField
              label="Nome completo"
              icon="person-outline"
              placeholder="Seu nome completo"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              error={error.name}
              editable={!isLoading}
              accessibilityLabel="Nome completo"
            />

            <AuthFormField
              label="E-mail"
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

            <AuthFormField
              label="Senha"
              icon="lock-closed-outline"
              placeholder="Crie uma senha forte"
              isPassword
              value={password}
              onChangeText={setPassword}
              error={error.password}
              editable={!isLoading}
              accessibilityLabel="Senha"
            />

            <AuthFormField
              label="Confirmar senha"
              icon="checkmark-circle-outline"
              placeholder="Repita sua senha"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={error.confirmPassword}
              editable={!isLoading}
              accessibilityLabel="Confirmar senha"
            />

            <Button
              title="Finalizar cadastro"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              onPress={handleCadastro}
              style={styles.submitButton}
            />
          </AuthCard>

          <AuthLinkFooter
            text="Já possui uma conta?"
            linkText="Entrar"
            accessibilityLabel="Entrar na conta"
            disabled={isLoading}
            onPress={() => router.replace("/(auth)/login")}
          />
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

    submitButton: {
      marginTop: theme.spacing.md,
    },
  });
