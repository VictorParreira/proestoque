import { useRouter } from "expo-router";
import React, { useState } from "react";
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
import { theme } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorEmail, setErrorEmail] = useState<string | undefined>(undefined);
  const [errorPassword, setErrorPassword] = useState<string | undefined>(
    undefined,
  );

  const handleLogin = async () => {
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
    await login(nameSimulado, email);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
            <LogoProEstoque size="lg" />
            <Text style={styles.subtitle}>Bem-vindo de volta!</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <Input
                icon="mail"
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                error={errorEmail}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <Input
                icon="lock-closed"
                placeholder="Digite sua senha"
                isPassword
                value={password}
                onChangeText={setPassword}
                error={errorPassword}
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordBtn}
              onPress={() => router.push("/(auth)/recuperar-senha")}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <Button
              title="Entrar no sistema"
              fullWidth
              onPress={handleLogin}
              loading={isLoading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Ainda não tem uma conta? </Text>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/cadastro")}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  subtitle: {
    marginTop: 16,
    color: theme.colors.textLight,
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4, // Sombra suave
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },

  inputGroup: {
    marginBottom: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4b5563",
    marginBottom: 8,
    marginLeft: 4,
  },
  forgotPasswordBtn: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 24,
    paddingVertical: 4,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 20,
  },
  footerText: {
    color: theme.colors.textLight,
    fontSize: 15,
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: "800",
    fontSize: 15,
  },
});
