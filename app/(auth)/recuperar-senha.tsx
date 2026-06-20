import { Ionicons } from "@expo/vector-icons";
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
import { AuthFormField } from "../../src/components/auth/AuthFormField";
import { AuthHeader } from "../../src/components/auth/AuthHeader";
import { Button } from "../../src/components/Button";
import type { ThemeType } from "../../src/constants/theme";
import { useAppTheme } from "../../src/contexts/ThemeContext";

export default function RecuperarSenha() {
  const router = useRouter();
  const { theme } = useAppTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

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
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/(auth)/login")}
            activeOpacity={0.72}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AuthHeader
            title="Recuperar senha"
            description="Informe seu e-mail e enviaremos um link seguro para redefinir sua senha."
            logoSize="md"
          />

          <AuthCard>
            {!enviado ? (
              <View style={styles.form}>
                <AuthFormField
                  label="E-mail de recuperação"
                  icon="mail-outline"
                  placeholder="Digite seu e-mail cadastrado"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                  error={errorEmail}
                  accessibilityLabel="E-mail de recuperação"
                />

                <Button
                  title="Enviar link"
                  fullWidth
                  onPress={handleEnviar}
                  style={styles.actionButton}
                />
              </View>
            ) : (
              <View style={styles.successContainer}>
                <View style={styles.successIconWrapper}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={56}
                    color={theme.colors.success}
                  />
                </View>

                <Text style={styles.successTitle}>E-mail enviado</Text>

                <Text style={styles.successText}>
                  Enviamos as instruções de recuperação para sua caixa de
                  entrada.
                </Text>

                <Button
                  title="Voltar ao login"
                  variant="outline"
                  fullWidth
                  onPress={() => router.replace("/(auth)/login")}
                  style={styles.actionButton}
                />
              </View>
            )}
          </AuthCard>
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

    topBar: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },

    backButton: {
      width: 44,
      height: 44,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.primarySubtle,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
    },

    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing["2xl"],
    },

    form: {
      width: "100%",
    },

    actionButton: {
      marginTop: theme.spacing.md,
    },

    successContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
    },

    successIconWrapper: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.pill,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.successSoft,
    },

    successTitle: {
      color: theme.colors.text,
      fontSize: theme.typography.title2.fontSize,
      lineHeight: theme.typography.title2.lineHeight,
      fontWeight: theme.typography.title2.fontWeight,
      textAlign: "center",
      marginBottom: theme.spacing.sm,
    },

    successText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.subheadline.fontSize,
      lineHeight: theme.typography.subheadline.lineHeight,
      fontWeight: "500",
      textAlign: "center",
      marginBottom: theme.spacing.lg,
    },
  });
