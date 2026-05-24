import { Ionicons } from "@expo/vector-icons";
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
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <LogoProEstoque size="md" />
            <Text style={styles.title}>Recuperar senha</Text>
            <Text style={styles.description}>
              Informe seu e-mail e enviaremos um link seguro para redefinir sua
              senha.
            </Text>
          </View>

          <View style={styles.card}>
            {!enviado ? (
              <View style={styles.form}>
                <Text style={styles.label}>E-mail de recuperação</Text>
                <Input
                  icon="mail"
                  placeholder="Digite seu e-mail cadastrado"
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
                  <Ionicons
                    name="checkmark-circle"
                    size={56}
                    color={theme.colors.success}
                  />
                </View>
                <Text style={styles.successTitle}>E-mail enviado!</Text>
                <Text style={styles.successText}>
                  Enviamos as instruções de recuperação para sua caixa de
                  entrada.
                </Text>
                <Button
                  title="Voltar ao Login"
                  variant="outline"
                  fullWidth
                  onPress={() => router.push("/(auth)/login")}
                  style={styles.actionButton}
                />
              </View>
            )}
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

  topBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
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
  description: {
    fontSize: 15,
    color: theme.colors.textLight,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
    paddingHorizontal: 10,
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
  form: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4b5563",
    marginBottom: 8,
    marginLeft: 4,
  },
  actionButton: {
    marginTop: 16,
  },

  successContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  successIconWrapper: {
    marginBottom: 16,
    backgroundColor: "#ecfdf5",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: 8,
  },
  successText: {
    color: theme.colors.textLight,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
});
