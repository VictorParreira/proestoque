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

export default function Cadastro() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleCadastro = async () => {
    let newError = { name: "", email: "", password: "", confirmPassword: "" };
    let isError = false;

    if (!name.trim()) {
      newError.name = "O nome é obrigatório";
      isError = true;
    }

    if (!email.trim()) {
      newError.email = "O e-mail é obrigatório";
      isError = true;
    }

    if (!password.trim()) {
      newError.password = "A senha é obrigatória";
      isError = true;
    }

    if (!confirmPassword.trim()) {
      newError.confirmPassword = "Confirme sua senha";
      isError = true;
    } else if (password !== confirmPassword) {
      newError.confirmPassword = "As senhas não coincidem";
      isError = true;
    }

    if (isError) {
      setError(newError);
      return;
    }

    setError({ name: "", email: "", password: "", confirmPassword: "" });

    await login(name, email);
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
            <LogoProEstoque size="md" />
            <Text style={styles.title}>Crie sua conta</Text>
            <Text style={styles.subtitle}>
              E comece a gerenciar seu estoque
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <Input
                icon="person"
                placeholder="Seu nome completo"
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
                error={error.name}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <Input
                icon="mail"
                placeholder="Seu melhor e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                error={error.email}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <Input
                icon="lock-closed"
                placeholder="Crie uma senha forte"
                isPassword
                value={password}
                onChangeText={setPassword}
                error={error.password}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar senha</Text>
              <Input
                icon="checkmark-circle"
                placeholder="Repita sua senha"
                isPassword
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={error.confirmPassword}
                editable={!isLoading}
              />
            </View>

            <Button
              title="Finalizar Cadastro"
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
              onPress={() => router.push("/(auth)/login")}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Entrar</Text>
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
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: theme.colors.text,
    marginTop: 20,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 6,
    color: theme.colors.textLight,
    fontSize: 15,
    fontWeight: "500",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4,
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
  submitButton: {
    marginTop: 16,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
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
