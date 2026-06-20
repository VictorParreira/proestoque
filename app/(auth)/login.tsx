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
import { AuthCard } from "../../src/components/auth/AuthCard";
import { AuthHeader } from "../../src/components/auth/AuthHeader";
import { AuthLinkFooter } from "../../src/components/auth/AuthLinkFooter";
import { Button } from "../../src/components/Button";
import { Input } from "../../src/components/Input";
import type { ThemeType } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";
import { useAppTheme } from "../../src/contexts/ThemeContext";

export default function Login() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { theme } = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorEmail, setErrorEmail] = useState<string | undefined>(undefined);
  const [errorPassword, setErrorPassword] = useState<string | undefined>(
    undefined,
  );

  const handleLogin = async () => {
    setErrorEmail(undefined);
    setErrorPassword(undefined);

    let hasError = false;

    if (!email.trim()) {
      setErrorEmail("O e-mail é obrigatório");
      hasError = true;
    }

    if (!password.trim()) {
      setErrorPassword("A senha é obrigatória");
      hasError = true;
    }

    if (hasError) return;

    const nameSimulado = email.split("@")[0] || "Usuário";
    await login(nameSimulado, email);
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
            title="Bem-vindo de volta!"
            description="Acesse sua conta para gerenciar produtos, estoque e alertas."
          />

          <AuthCard>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>

              <Input
                icon="mail-outline"
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                error={errorEmail}
                editable={!isLoading}
                accessibilityLabel="E-mail"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>

              <Input
                icon="lock-closed-outline"
                placeholder="Digite sua senha"
                isPassword
                value={password}
                onChangeText={setPassword}
                error={errorPassword}
                editable={!isLoading}
                accessibilityLabel="Senha"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.forgotPasswordButton,
                isLoading && styles.disabledAction,
              ]}
              onPress={() => router.replace("/(auth)/recuperar-senha")}
              disabled={isLoading}
              activeOpacity={0.72}
              accessibilityRole="button"
              accessibilityLabel="Recuperar senha"
            >
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <Button
              title="Entrar no sistema"
              fullWidth
              onPress={handleLogin}
              loading={isLoading}
            />
          </AuthCard>

          <AuthLinkFooter
            text="Ainda não tem uma conta?"
            linkText="Cadastre-se"
            accessibilityLabel="Criar conta"
            disabled={isLoading}
            onPress={() => router.replace("/(auth)/cadastro")}
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
      justifyContent: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
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

    forgotPasswordButton: {
      alignSelf: "flex-end",
      marginTop: -theme.spacing.xs,
      marginBottom: theme.spacing.lg,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.xs,
    },

    forgotPasswordText: {
      color: theme.colors.primary,
      fontWeight: "700",
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
    },

    disabledAction: {
      opacity: theme.opacity.disabled,
    },
  });
