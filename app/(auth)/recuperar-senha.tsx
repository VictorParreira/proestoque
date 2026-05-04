import { Ionicons } from "@expo/vector-icons";
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

export default function RecuperarSenha() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  const [errorEmail, setErrorEmail] = useState<string | undefined>(undefined);

  const handleEnviar = () => {
    setErrorEmail(undefined);

    if (!email.trim()) {
      setErrorEmail("Informe um e-mail válido para continuar");
      return;
    }

    setEnviado(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <LogoProEstoque size="md" />
          <Text style={styles.title}>Recuperar senha</Text>
          <Text style={styles.description}>
            Informe seu e-mail e enviaremos um link para redefinir sua senha.
          </Text>

          {!enviado ? (
            <View style={styles.form}>
              <Input
                icon="mail-outline"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                error={errorEmail}
              />
              <Button
                title="Enviar Link"
                fullWidth
                onPress={handleEnviar}
                style={styles.actionButton}
              />
            </View>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.successIconWrapper}>
                <Ionicons name="mail" size={32} color={theme.colors.success} />
              </View>
              <Text style={styles.successTitle}>E-mail enviado!</Text>
              <Text style={styles.successText}>
                Verifique sua caixa de entrada
              </Text>
            </View>
          )}

          {enviado && (
            <Button
              title="Voltar ao Login"
              variant="outline"
              fullWidth
              onPress={() => router.push("/(auth)/login")}
              style={styles.actionButton}
            />
          )}
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
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontWeight: "600",
    marginLeft: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textLight,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  form: {
    width: "100%",
  },
  actionButton: {
    marginTop: theme.spacing.md,
  },
  successContainer: {
    backgroundColor: "#E8F8EE",
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    width: "100%",
    borderColor: "#BBEACA",
    borderWidth: 1,
    marginBottom: theme.spacing.xl,
  },
  successIconWrapper: {
    backgroundColor: "#D1F0DC",
    padding: theme.spacing.md,
    borderRadius: 50,
    marginBottom: theme.spacing.md,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.success,
    marginBottom: theme.spacing.xl,
  },
  successText: {
    color: "#2A9A48",
    fontSize: 14,
  },
});
