import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";

import {
  CATEGORIAS_MOCK,
  formatarPreco,
  getProdutosComEstoqueBaixo,
  getValorTotalEstoque,
  Produto,
  PRODUTOS_MOCK,
} from "../../src/data/mockData";

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const alertas = useMemo(() => getProdutosComEstoqueBaixo(), []);
  const valorTotal = useMemo(() => getValorTotalEstoque(), []);

  const saudacao = useMemo(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const inicialUsuario = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const cardsResumo = [
    {
      id: "total",
      titulo: "Produtos",
      valor: PRODUTOS_MOCK.length,
      icone: "cube-outline" as const,
      corFundo: "#f5f3ff",
      corIcone: "#7c3aed",
    },
    {
      id: "alertas",
      titulo: "Alertas",
      valor: alertas.length,
      icone: "alert-circle-outline" as const,
      corFundo: "#fef2f2",
      corIcone: "#dc2626",
    },
    {
      id: "categorias",
      titulo: "Categorias",
      valor: CATEGORIAS_MOCK.length,
      icone: "grid-outline" as const,
      corFundo: "#eff6ff",
      corIcone: "#2563eb",
    },
    {
      id: "valor",
      titulo: "Em Estoque",
      valor: formatarPreco(valorTotal),
      icone: "cash-outline" as const,
      corFundo: "#ecfdf5",
      corIcone: "#059669",
    },
  ];

  const dataHoje = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
  }).format(new Date());

  const DashboardHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.saudacaoContainer}>
        <View>
          <Text style={styles.saudacaoTitulo}>
            {saudacao}, {user?.name || "Visitante"}
          </Text>
          <Text style={styles.saudacaoSub}>
            {dataHoje.charAt(0).toUpperCase() + dataHoje.slice(1)}
          </Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{inicialUsuario}</Text>
        </View>
      </View>

      <View style={styles.cardsGrid}>
        {cardsResumo.map((card) => (
          <View
            key={card.id}
            style={[styles.card, { backgroundColor: card.corFundo }]}
          >
            <Ionicons name={card.icone} size={18} color={card.corIcone} />
            <Text style={styles.cardValor}>{card.valor}</Text>
            <Text style={styles.cardTitulo}>{card.titulo}</Text>
          </View>
        ))}
      </View>

      {alertas.length > 0 && (
        <View style={styles.alertasContainer}>
          <Text style={styles.alertasTitulo}>
            Estoque crítico ({alertas.length})
          </Text>
          {alertas.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.alertaRow}>
              <Text style={styles.alertaTexto}>{item.nome}</Text>
              <Text style={styles.alertaQuantidade}>
                {item.quantidade}/{item.quantidadeMinima}
              </Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Produtos recentes</Text>
    </View>
  );

  const renderProduto = ({ item }: { item: Produto }) => {
    let statusCor = "#059669";
    let statusBg = "#d1fae5";
    let statusTexto = "Normal";

    if (item.quantidade === 0) {
      statusCor = "#dc2626";
      statusBg = "#fee2e2";
      statusTexto = "Sem estoque";
    } else if (item.quantidade < item.quantidadeMinima) {
      statusCor = "#d97706";
      statusBg = "#fef3c7";
      statusTexto = "Baixo";
    }

    return (
      <View style={styles.produtoCard}>
        <View style={styles.produtoInfo}>
          <View style={styles.produtoIcone}>
            <Ionicons name="cube-outline" size={20} color="#7c3aed" />
          </View>
          <View>
            <Text style={styles.produtoNome}>{item.nome}</Text>
            <Text style={styles.produtoQtd}>
              {item.quantidade} {item.unidade}
            </Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: statusBg }]}>
          <Text style={[styles.badgeText, { color: statusCor }]}>
            {statusTexto}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <FlatList
        data={PRODUTOS_MOCK}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        ListHeaderComponent={DashboardHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7c3aed"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listContent: { paddingBottom: 20 },
  headerContainer: { padding: 20 },
  saudacaoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  saudacaoTitulo: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  saudacaoSub: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
    textTransform: "capitalize",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#7c3aed",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },

  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  cardValor: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 8,
  },
  cardTitulo: { fontSize: 12, color: "#6b7280", marginTop: 2 },

  alertasContainer: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  alertasTitulo: {
    color: "#b91c1c",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 14,
  },
  alertaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  alertaTexto: { color: "#374151", fontSize: 12 },
  alertaQuantidade: {
    color: "#dc2626",
    fontWeight: "bold",
    fontFamily: "monospace",
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 10,
  },
  produtoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  produtoInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  produtoIcone: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#f5f3ff",
    justifyContent: "center",
    alignItems: "center",
  },
  produtoNome: { fontSize: 14, fontWeight: "600", color: "#1f2937" },
  produtoQtd: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: "bold" },
});
