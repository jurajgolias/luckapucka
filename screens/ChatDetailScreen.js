import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";
import { getChatroomById, getMessagesByChatroomId, addMessage } from "../models/messages";
import { mockUsers } from "../models/users";

export default function ChatDetailScreen({ navigation, route }) {
  const { user } = useUser();
  const { chatroomId } = route.params;
  const chatroom = getChatroomById(chatroomId);
  const [messages, setMessages] = useState(getMessagesByChatroomId(chatroomId));
  const [messageText, setMessageText] = useState("");

  if (!chatroom) {
    return (
      <View style={styles.container}>
        <Text>Chat nebol nájdený</Text>
      </View>
    );
  }

  const getChatroomInfo = () => {
    if (chatroom.type === "group") {
      return {
        name: chatroom.name,
        subtitle: `${chatroom.participants.length} členov`,
        avatar: chatroom.name[0],
      };
    } else {
      const otherUserId = chatroom.participants.find((id) => id !== user?.id);
      const otherUser = mockUsers.find((u) => u.id === otherUserId);
      return {
        name: otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Používateľ",
        subtitle: otherUser?.role || "",
        avatar: otherUser ? `${otherUser.firstName[0]}${otherUser.lastName[0]}` : "U",
      };
    }
  };

  const chatroomInfo = getChatroomInfo();

  const getUserById = (userId) => {
    return mockUsers.find((u) => u.id === userId);
  };

  const getInitials = (text) => {
    if (text && text.length > 0) {
      return text.substring(0, 2).toUpperCase();
    }
    return "?";
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("sk-SK", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSend = () => {
    if (!messageText.trim() || !user) return;

    addMessage(chatroomId, user.id, messageText.trim());
    setMessages(getMessagesByChatroomId(chatroomId));
    setMessageText("");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(chatroomInfo.avatar)}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.chatTitle}>{chatroomInfo.name}</Text>
          <Text style={styles.chatSubtitle}>{chatroomInfo.subtitle}</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="chat-outline" size={48} color="#999" />
            <Text style={styles.emptyStateText}>Žiadne správy</Text>
            <Text style={styles.emptyStateSubtext}>Začnite konverzáciu</Text>
          </View>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === user?.id;
            const sender = getUserById(message.senderId);
            
            return (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  isOwn ? styles.messageOwn : styles.messageOther,
                ]}
              >
                {!isOwn && (
                  <View style={styles.messageAvatar}>
                    <Text style={styles.messageAvatarText}>
                      {sender ? `${sender.firstName[0]}${sender.lastName[0]}` : "U"}
                    </Text>
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    isOwn ? styles.messageBubbleOwn : styles.messageBubbleOther,
                  ]}
                >
                  {!isOwn && chatroom.type === "group" && (
                    <Text style={styles.messageSender}>
                      {sender ? `${sender.firstName} ${sender.lastName}` : "Používateľ"}
                    </Text>
                  )}
                  <Text
                    style={[
                      styles.messageText,
                      isOwn ? styles.messageTextOwn : styles.messageTextOther,
                    ]}
                  >
                    {message.text}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      isOwn ? styles.messageTimeOwn : styles.messageTimeOther,
                    ]}
                  >
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Napíšte správu..."
          placeholderTextColor="#999"
          value={messageText}
          onChangeText={setMessageText}
          multiline={true}
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <MaterialCommunityIcons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("TrainingList")}
        >
          <MaterialCommunityIcons name="calendar-month" size={24} color="#666" />
          <Text style={styles.navLabel}>Tréningy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, styles.navItemActive]}
          onPress={() => navigation.navigate("Messages")}
        >
          <MaterialCommunityIcons name="chat" size={24} color="#2196F3" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Správy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <MaterialCommunityIcons name="account" size={24} color="#666" />
          <Text style={styles.navLabel}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2196F3",
  },
  headerInfo: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  chatSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-end",
  },
  messageOwn: {
    justifyContent: "flex-end",
  },
  messageOther: {
    justifyContent: "flex-start",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  messageAvatarText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2196F3",
  },
  messageBubble: {
    maxWidth: "70%",
    borderRadius: 16,
    padding: 12,
  },
  messageBubbleOwn: {
    backgroundColor: "#2196F3",
  },
  messageBubbleOther: {
    backgroundColor: "#E0E0E0",
  },
  messageSender: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTextOwn: {
    color: "#fff",
  },
  messageTextOther: {
    color: "#333",
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  messageTimeOwn: {
    color: "#E3F2FD",
  },
  messageTimeOther: {
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 10,
    paddingBottom: 20,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navItemActive: {
    // Active state styling can be added here
  },
  navLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  navLabelActive: {
    color: "#2196F3",
    fontWeight: "600",
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
});
