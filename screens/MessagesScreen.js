import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";
import { getChatroomsByUserId, getMessagesByChatroomId, createPrivateChatroom, createTeamChatroom } from "../models/messages";
import { mockUsers, getPlayersByTeamId } from "../models/users";
import { getTeamsByTrainer, getTeamsByIds, mockTeams } from "../models/teams";
import { useFocusEffect } from "@react-navigation/native";
import BottomNav from "../components/BottomNav";

export default function MessagesScreen({ navigation }) {
  const { user } = useUser();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const trainerTeams = user?.role === "trainer" ? getTeamsByTrainer(user.id) : [];
  const playerTeams = user?.role === "player" ? getTeamsByIds(user.teamIds || []) : [];
  const managerTeams = user?.role === "manager" ? mockTeams : [];
  const accessibleTeams = user?.role === "trainer"
    ? trainerTeams
    : user?.role === "player"
    ? playerTeams
    : user?.role === "manager"
    ? managerTeams
    : [];

  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  const userChatrooms = user ? getChatroomsByUserId(user.id) : [];

  const getChatroomInfo = (chatroom) => {
    if (chatroom.type === "group") {
      return {
        name: chatroom.name,
        avatar: chatroom.name[0],
      };
    } else {
      // Private chat - zobraziť meno druhého používateľa
      const otherUserId = chatroom.participants.find((id) => id !== user?.id);
      const otherUser = mockUsers.find((u) => u.id === otherUserId);
      return {
        name: otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Používateľ",
        avatar: otherUser ? `${otherUser.firstName[0]}${otherUser.lastName[0]}` : "U",
      };
    }
  };

  const getLastMessage = (chatroomId) => {
    const messages = getMessagesByChatroomId(chatroomId);
    if (messages.length === 0) {
      return { text: "Žiadne správy", time: "" };
    }
    const lastMsg = messages[messages.length - 1];
    const date = new Date(lastMsg.timestamp);
    return {
      text: lastMsg.text,
      time: date.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const handleCreatePrivateChat = (otherUserId) => {
    const chatroom = createPrivateChatroom(user.id, otherUserId);
    setShowNewChatModal(false);
    setRefreshKey(prev => prev + 1);
    navigation.navigate("ChatDetail", { chatroomId: chatroom.id });
  };

  const handleCreateTeamChat = (team) => {
    const teamPlayers = getPlayersByTeamId(team.id);
    const participantIds = Array.from(
      new Set([
        team.trainerId,
        ...teamPlayers.map((p) => p.id),
        user?.id,
      ].filter(Boolean))
    );
    const chatroom = createTeamChatroom(team.id, team.name, participantIds);
    setShowNewChatModal(false);
    setRefreshKey(prev => prev + 1);
    navigation.navigate("ChatDetail", { chatroomId: chatroom.id });
  };

  // Získať používateľov s ktorými môžem chatovať (okrem seba)
  const availableUsers = mockUsers.filter((u) => u.id !== user?.id);

  const getInitials = (text) => {
    if (text && text.length > 0) {
      return text.substring(0, 2).toUpperCase();
    }
    return "?";
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Správy</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowNewChatModal(true)}
          >
            <MaterialCommunityIcons name="chat" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Nový chat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {userChatrooms.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="chat-outline" size={48} color="#999" />
              <Text style={styles.emptyStateText}>Žiadne konverzácie</Text>
              <Text style={styles.emptyStateSubtext}>Začnite novú konverzáciu</Text>
            </View>
          ) : (
            userChatrooms.map((chatroom) => {
              const info = getChatroomInfo(chatroom);
              const lastMessage = getLastMessage(chatroom.id);
              return (
                <TouchableOpacity
                  key={chatroom.id}
                  style={styles.chatCard}
                  onPress={() => navigation.navigate("ChatDetail", { chatroomId: chatroom.id })}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitials(info.avatar)}</Text>
                  </View>
                  <View style={styles.chatInfo}>
                    <View style={styles.chatHeader}>
                      <Text style={styles.chatName}>{info.name}</Text>
                      <Text style={styles.chatTime}>{lastMessage.time}</Text>
                    </View>
                    <Text style={styles.chatLastMessage} numberOfLines={1}>
                      {lastMessage.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Modal pre výber používateľa */}
      <Modal
        visible={showNewChatModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewChatModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nový chat</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowNewChatModal(false)}
              >
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView 
              style={styles.userList}
              showsVerticalScrollIndicator={false}
            >
              {accessibleTeams.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Chat s tímom</Text>
                  {accessibleTeams.map((team) => {
                    const teamPlayersCount = getPlayersByTeamId(team.id).length;
                    return (
                      <TouchableOpacity
                        key={team.id}
                        style={styles.userItem}
                        onPress={() => handleCreateTeamChat(team)}
                      >
                        <View style={styles.userAvatar}>
                          <Text style={styles.userAvatarText}>{getInitials(team.name)}</Text>
                        </View>
                        <View style={styles.userInfo}>
                          <Text style={styles.userName}>{team.name}</Text>
                          <Text style={styles.userRole}>{teamPlayersCount} hráčov</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
                      </TouchableOpacity>
                    );
                  })}
                  <View style={styles.sectionDivider} />
                </>
              )}

              <Text style={styles.sectionTitle}>Chat s používateľom</Text>
              {availableUsers.map((u) => (
                <TouchableOpacity
                  key={u.id}
                  style={styles.userItem}
                  onPress={() => handleCreatePrivateChat(u.id)}
                >
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>
                      {u.firstName[0]}{u.lastName[0]}
                    </Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                      {u.firstName} {u.lastName}
                    </Text>
                    <Text style={styles.userRole}>
                      {u.role === "player" ? "Hráč" : 
                       u.role === "trainer" ? "Tréner" :
                       u.role === "manager" ? "Manažér" : "Admin"}
                    </Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <BottomNav navigation={navigation} active="Messages" />
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
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#2196F3",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  chatCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2196F3",
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  chatTime: {
    fontSize: 12,
    color: "#999",
  },
  chatLastMessage: {
    fontSize: 14,
    color: "#666",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    fontWeight: "600",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  userList: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#444",
    marginTop: 8,
    marginBottom: 6,
    marginLeft: 8,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2196F3",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 13,
    color: "#666",
    textTransform: "capitalize",
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 12,
  },
});