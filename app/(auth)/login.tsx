import { useRouter } from "expo-router";
import React, { useState } from "react";
import { AuthCard } from "../../src/components/auth/AuthCard";
import { AuthFormField } from "../../src/components/auth/AuthFormField";
import { AuthHeader } from "../../src/components/auth/AuthHeader";
import { AuthLinkFooter } from "../../src/components/auth/AuthLinkFooter";
import { AuthScreenLayout } from "../../src/components/auth/AuthScreenLayout";
import { AuthTextButton } from "../../src/components/auth/AuthTextButton";
import { Button } from "../../src/components/Button";
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

    const normalizedEmail = email.trim();

    let hasError = false;

    if (!normalizedEmail) {
      setErrorEmail("O e-mail é obrigatório");
      hasError = true;
    }

    if (!password.trim()) {
      setErrorPassword("A senha é obrigatória");
      hasError = true;
    }

    if (hasError) return;

    const nameSimulado = normalizedEmail.split("@")[0] || "Usuário";
    await login(nameSimulado, normalizedEmail);
  };

  return (
    <AuthScreenLayout centerContent>
      <AuthHeader
        title="Bem-vindo de volta!"
        description="Acesse sua conta para gerenciar produtos, estoque e alertas."
      />

      <AuthCard>
        <AuthFormField
          label="E-mail"
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

        <AuthFormField
          label="Senha"
          icon="lock-closed-outline"
          placeholder="Digite sua senha"
          isPassword
          value={password}
          onChangeText={setPassword}
          error={errorPassword}
          editable={!isLoading}
          accessibilityLabel="Senha"
        />

        <AuthTextButton
          title="Esqueceu a senha?"
          accessibilityLabel="Recuperar senha"
          disabled={isLoading}
          onPress={() => router.replace("/(auth)/recuperar-senha")}
        />

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
    </AuthScreenLayout>
  );
}
