import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";
import { getPlayersByTeamId, mockUsers, addPlayerToTeam } from "../models/users";
import BottomNav from "../components/BottomNav";

export default function TeamDetailScreen({ navigation, route }) {
  const { user } = useUser();
  const { team } = route.params;
  const [players, setPlayers] = useState(getPlayersByTeamId(team.id));
  const [showAddModal, setShowAddModal] = useState(false);

  const availablePlayers = mockUsers.filter(
    (u) => u.role === "player" && !(u.teamIds || []).includes(team.id)
  );

  const getInitials = (user) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return "U";
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{team.name}</Text>
            <Text style={styles.subtitle}>{team.sport}</Text>
          </View>
        </View>

        {/* Team Info */}
        <View style={styles.content}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account-multiple" size={20} color="#666" />
              <Text style={styles.infoText}>{players.length} členov</Text>
            </View>
          </View>

          {/* Trainer actions */}
          {user?.role === "trainer" && team.trainerId === user.id && (
            <TouchableOpacity
              style={styles.addPlayerButton}
              onPress={() => setShowAddModal(true)}
            >
              <MaterialCommunityIcons name="account-plus" size={20} color="#fff" />
              <Text style={styles.addPlayerText}>Pridať hráča</Text>
            </TouchableOpacity>
          )}

          {/* Players List */}
          <Text style={styles.sectionTitle}>Hráči</Text>
          {players.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="account-off" size={48} color="#999" />
              <Text style={styles.emptyStateText}>Žiadni hráči v tíme</Text>
            </View>
          ) : (
            players.map((player) => (
              <View key={player.id} style={styles.playerCard}>
                <View style={styles.playerAvatar}>
                  <Text style={styles.playerAvatarText}>{getInitials(player)}</Text>
                </View>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>
                    {player.firstName} {player.lastName}
                  </Text>
                  <Text style={styles.playerEmail}>{player.email}</Text>
                  <Text style={styles.playerAge}>{player.age} rokov</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add player modal */}
      <Modal
        transparent
        visible={showAddModal}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pridať hráča</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {availablePlayers.length === 0 ? (
              <View style={styles.emptyModalState}>
                <MaterialCommunityIcons name="account-check" size={42} color="#999" />
                <Text style={styles.emptyStateText}>Všetci hráči sú už pridaní</Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 320 }}>
                {availablePlayers.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.modalItem}
                    onPress={() => {
                      addPlayerToTeam(team.id, p.id);
                      setPlayers(getPlayersByTeamId(team.id));
                      setShowAddModal(false);
                    }}
                  >
                    <View style={styles.modalAvatar}>
                      <Text style={styles.modalAvatarText}>{getInitials(p)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalName}>{p.firstName} {p.lastName}</Text>
                      <Text style={styles.modalSub}>{p.email}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={22} color="#ccc" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
      <BottomNav navigation={navigation} active="TrainerTeams" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  playerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  playerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  playerAvatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  playerEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  playerAge: {
    fontSize: 12,
    color: "#999",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 12,
  },
  addPlayerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  addPlayerText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingBottom: 12,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  modalAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  modalAvatarText: {
    color: "#2196F3",
    fontWeight: "700",
    fontSize: 14,
  },
  modalName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  modalSub: {
    fontSize: 13,
    color: "#666",
  },
  emptyModalState: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 8,
  },
});
