import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../src/components/Button";
import { Input } from "../../src/components/Input";
import { LogoProEstoque } from "../../src/components/LogoProEstoque";
import { theme } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorEmail, setErrorEmail] = useState<string | undefined>(undefined);
  const [errorPassword, setErrorPassword] = useState<string | undefined>(
    undefined,
  );

  const handleLogin = () => {
    setErrorEmail(undefined);
    setErrorPassword(undefined);

    let isError = false;

    if (!email.trim()) {
      setErrorEmail("O e-mail é obrigatório");
      isError = true;
    }

    if (!password.trim()) {
      setErrorPassword("A senha é obrigatória");
      isError = true;
    }

    if (isError) return;

    const nameSimulado = email.split("@")[0] || "Usuário";
    signIn(nameSimulado, email);
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <LogoProEstoque size="md" />
          <Text style={styles.subtitle}>Bem-vindo de volta</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>
          <Input
            icon="mail-outline"
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={errorEmail}
          />

          <Text style={styles.label}>Senha</Text>
          <Input
            icon="lock-closed-outline"
            placeholder="Senha"
            isPassword
            value={password}
            onChangeText={setPassword}
            error={errorPassword}
          />

          <TouchableOpacity
            onPress={() => router.push("/(auth)/recuperar-senha")}
          >
            <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <Button
            title="Entrar"
            fullWidth
            onPress={handleLogin}
            style={styles.loginButton}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Não tem conta? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/cadastro")}>
              <Text style={styles.linkText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl * 1.5,
  },
  subtitle: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textLight,
    fontSize: 16,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  forgotPassword: {
    color: theme.colors.primary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  loginButton: {
    marginBottom: theme.spacing.lg,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: theme.colors.textLight,
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
});
