import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AuthBackButton } from "../../src/components/auth/AuthBackButton";
import { AuthCard } from "../../src/components/auth/AuthCard";
import { AuthFormField } from "../../src/components/auth/AuthFormField";
import { AuthHeader } from "../../src/components/auth/AuthHeader";
import { AuthScreenLayout } from "../../src/components/auth/AuthScreenLayout";
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
    <AuthScreenLayout
      topSlot={
        <AuthBackButton onPress={() => router.replace("/(auth)/login")} />
      }
      contentContainerStyle={styles.scrollContent}
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
              Enviamos as instruções de recuperação para sua caixa de entrada.
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
    </AuthScreenLayout>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    scrollContent: {
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
