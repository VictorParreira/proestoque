import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
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
import { theme } from "../../src/constants/theme";
import { useAuth } from "../../src/contexts/AuthContext";

export default function ConfiguracoesScreen() {
  const { user, logout } = useAuth();
  const [notificacoes, setNotificacoes] = useState(true);
  const [modoEscuro, setModoEscuro] = useState(false);

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
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Preferências</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingsRow}>
            <View style={styles.settingsIconBg}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#4b5563"
              />
            </View>
            <Text style={styles.settingsLabel}>Notificações de Estoque</Text>
            <Switch
              value={notificacoes}
              onValueChange={setNotificacoes}
              trackColor={{ false: "#d1d5db", true: theme.colors.primary }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingsRow}>
            <View style={styles.settingsIconBg}>
              <Ionicons name="moon-outline" size={20} color="#4b5563" />
            </View>
            <Text style={styles.settingsLabel}>Modo Escuro (Beta)</Text>
            <Switch
              value={modoEscuro}
              onValueChange={setModoEscuro}
              trackColor={{ false: "#d1d5db", true: theme.colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dados e Suporte</Text>
        <View style={styles.settingsGroup}>
          <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
            <View style={styles.settingsIconBg}>
              <Ionicons
                name="cloud-download-outline"
                size={20}
                color="#4b5563"
              />
            </View>
            <Text style={styles.settingsLabel}>Exportar Relatório (CSV)</Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
            <View style={styles.settingsIconBg}>
              <Ionicons name="help-buoy-outline" size={20} color="#4b5563" />
            </View>
            <Text style={styles.settingsLabel}>Central de Ajuda</Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        <View style={styles.dangerGroup}>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="#dc2626" />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>ProEstoque v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
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
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  profileInfo: { flex: 1, marginLeft: 16 },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 2,
  },
  profileEmail: { fontSize: 14, color: "#6b7280" },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f3ff",
    justifyContent: "center",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingsGroup: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  settingsIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingsLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginLeft: 64,
  },

  dangerGroup: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.02)",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "700",
    color: "#dc2626",
  },

  versionText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "500",
  },
});
