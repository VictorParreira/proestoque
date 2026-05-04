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
  const { signIn } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleCadastro = () => {
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
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      signIn(name, email);
      router.replace("/(tabs)");
    }, 2000);
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
        >
          <View style={styles.header}>
            <LogoProEstoque size="sm" />
            <Text style={styles.title}>Criar conta</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nome completo</Text>
            <Input
              icon="person-outline"
              placeholder="Nome"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              error={error.name}
            />

            <Text style={styles.label}>E-mail</Text>
            <Input
              icon="mail-outline"
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              error={error.email}
            />

            <Text style={styles.label}>Senha</Text>
            <Input
              icon="lock-closed-outline"
              placeholder="Senha"
              isPassword
              value={password}
              onChangeText={setPassword}
              error={error.password}
            />

            <Text style={styles.label}>Confirmar senha</Text>
            <Input
              icon="lock-closed-outline"
              placeholder="Confirmar senha"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={error.confirmPassword}
            />

            <Button
              title="Criar Conta"
              fullWidth
              loading={loading}
              onPress={handleCadastro}
              style={styles.submitButton}
            />

            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.linkText}>Já tenho conta</Text>
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
    padding: theme.spacing.lg,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
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
  submitButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: "bold",
    textAlign: "center",
  },
});
