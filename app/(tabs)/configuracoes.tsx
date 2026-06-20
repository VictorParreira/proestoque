import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SettingsDivider } from "../../src/components/settings/SettingsDivider";
import { SettingsGroup } from "../../src/components/settings/SettingsGroup";
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

  const inicialUsuario = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Configurações</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{inicialUsuario}</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || "Visitante"}</Text>
            <Text style={styles.profileEmail}>
              {user?.email || "usuario@email.com"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            activeOpacity={0.72}
            accessibilityRole="button"
            accessibilityLabel="Editar perfil"
          >
            <Ionicons name="pencil" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

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
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.72}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Sair da conta"
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              color={theme.colors.error}
            />

            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
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

    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.xl,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.separator,
      shadowColor: theme.shadow.sm.shadowColor,
      shadowOffset: theme.shadow.sm.shadowOffset,
      shadowOpacity: theme.shadow.sm.shadowOpacity,
      shadowRadius: theme.shadow.sm.shadowRadius,
      elevation: theme.shadow.sm.elevation,
    },

    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.24,
      shadowRadius: 8,
      elevation: 3,
    },

    avatarText: {
      color: theme.colors.primaryContrast,
      fontSize: theme.typography.title2.fontSize,
      lineHeight: theme.typography.title2.lineHeight,
      fontWeight: "700",
    },

    profileInfo: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },

    profileName: {
      fontSize: theme.typography.headline.fontSize,
      lineHeight: theme.typography.headline.lineHeight,
      fontWeight: theme.typography.headline.fontWeight,
      color: theme.colors.text,
      marginBottom: 2,
    },

    profileEmail: {
      fontSize: theme.typography.footnote.fontSize,
      lineHeight: theme.typography.footnote.lineHeight,
      color: theme.colors.textSecondary,
    },

    editButton: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.pill,
      backgroundColor: theme.colors.primarySubtle,
      justifyContent: "center",
      alignItems: "center",
    },

    dangerGroup: {
      marginTop: theme.spacing.sm,
    },

    logoutButton: {
      minHeight: 60,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },

    logoutText: {
      marginLeft: theme.spacing.sm,
      fontSize: theme.typography.callout.fontSize,
      lineHeight: theme.typography.callout.lineHeight,
      fontWeight: "700",
      color: theme.colors.error,
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
