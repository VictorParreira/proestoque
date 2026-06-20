import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SettingsDivider } from "../../src/components/settings/SettingsDivider";
import { SettingsGroup } from "../../src/components/settings/SettingsGroup";
import { SettingsLogoutButton } from "../../src/components/settings/SettingsLogoutButton";
import { SettingsProfileCard } from "../../src/components/settings/SettingsProfileCard";
import { SettingsRow } from "../../src/components/settings/SettingsRow";
import { SettingsSectionTitle } from "../../src/components/settings/SettingsSectionTitle";
import { ThemePreferenceSelector } from "../../src/components/settings/ThemePreferenceSelector";
import type { ThemeType } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";
import { useAppTheme } from "../../src/contexts/ThemeContext";

export default function ConfiguracoesScreen() {
  const { user, logout } = useAuth();
  const { preference, setThemePreference, theme } = useAppTheme();

  const [notificacoes, setNotificacoes] = useState(true);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleLogout = () => {
    Alert.alert(
      "Sair do aplicativo",
      "Tem certeza que deseja desconectar sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: logout,
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Configurações</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SettingsProfileCard
          name={user?.name}
          email={user?.email}
          onEdit={() => {
            Alert.alert(
              "Editar perfil",
              "A edição de perfil será implementada em uma próxima etapa.",
            );
          }}
        />

        <SettingsSectionTitle>Preferências</SettingsSectionTitle>

        <SettingsGroup>
          <SettingsRow
            icon="notifications-outline"
            label="Notificações de Estoque"
            rightContent={
              <Switch
                value={notificacoes}
                onValueChange={setNotificacoes}
                trackColor={{
                  false: theme.colors.surfaceTertiary,
                  true: theme.colors.primary,
                }}
                thumbColor={theme.colors.primaryContrast}
                ios_backgroundColor={theme.colors.surfaceTertiary}
              />
            }
          />

          <SettingsDivider />

          <ThemePreferenceSelector
            value={preference}
            onChange={setThemePreference}
          />
        </SettingsGroup>

        <SettingsSectionTitle>Dados e Suporte</SettingsSectionTitle>

        <SettingsGroup>
          <SettingsRow
            icon="cloud-download-outline"
            label="Exportar Relatório (CSV)"
            accessibilityLabel="Exportar relatório em CSV"
            onPress={() => {
              Alert.alert(
                "Exportar relatório",
                "A exportação em CSV será implementada em uma próxima etapa.",
              );
            }}
            rightContent={
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textTertiary}
              />
            }
          />

          <SettingsDivider />

          <SettingsRow
            icon="help-buoy-outline"
            label="Central de Ajuda"
            accessibilityLabel="Abrir central de ajuda"
            onPress={() => {
              Alert.alert(
                "Central de Ajuda",
                "A central de ajuda será implementada em uma próxima etapa.",
              );
            }}
            rightContent={
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textTertiary}
              />
            }
          />
        </SettingsGroup>

        <SettingsGroup style={styles.dangerGroup}>
          <SettingsLogoutButton onPress={handleLogout} />
        </SettingsGroup>

        <Text style={styles.versionText}>ProEstoque v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
    },

    titulo: {
      fontSize: theme.typography.largeTitle.fontSize,
      lineHeight: theme.typography.largeTitle.lineHeight,
      fontWeight: theme.typography.largeTitle.fontWeight,
      color: theme.colors.text,
      letterSpacing: -0.7,
    },

    scrollContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing["3xl"],
    },

    dangerGroup: {
      marginTop: theme.spacing.sm,
    },

    versionText: {
      textAlign: "center",
      marginTop: theme.spacing.xl,
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
  });
