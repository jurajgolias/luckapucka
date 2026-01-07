import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";
import { getTrainingById, updateTraining, deleteTraining } from "../models/trainings";
import { getAttendanceByTraining } from "../models/attendance";
import { confirmAttendance, unconfirmAttendance } from "../models/attendance";
import { mockUsers } from "../models/users";
import BottomNav from "../components/BottomNav";

export default function TrainingDetailScreen({ navigation, route }) {
  const { user } = useUser();
  const { trainingId } = route.params;
  const training = getTrainingById(trainingId);
  const [attendance, setAttendance] = useState(getAttendanceByTraining(trainingId));
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editForm, setEditForm] = useState({
    date: training?.date || "",
    time: training?.time || "",
    location: training?.location || "",
    description: training?.description || "",
  });

  // Update attendance when it changes
  useEffect(() => {
    setAttendance(getAttendanceByTraining(trainingId));
  }, [trainingId]);

  if (!training) {
    return (
      <View style={styles.container}>
        <Text>Tréning nebol nájdený</Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = [
      "nedeľa",
      "pondelok",
      "utorok",
      "streda",
      "štvrtok",
      "piatok",
      "sobota",
    ];
    const months = [
      "januára",
      "februára",
      "marca",
      "apríla",
      "mája",
      "júna",
      "júla",
      "augusta",
      "septembra",
      "októbra",
      "novembra",
      "decembra",
    ];
    return `${days[date.getDay()]} ${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getRecurrenceText = (recurrence) => {
    const recurrences = {
      weekly: "Týždenne",
      daily: "Denne",
      monthly: "Mesačne",
      none: "Bez opakovania",
    };
    return recurrences[recurrence] || recurrence;
  };

  const getUserById = (id) => {
    return mockUsers.find((u) => u.id === id) || null;
  };

  const getInitials = (user) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return "U";
  };

  const handleConfirm = () => {
    if (user) {
      confirmAttendance(trainingId, user.id);
      setAttendance(getAttendanceByTraining(trainingId)); // Update state
    }
  };

  const handleUnconfirm = () => {
    if (user) {
      unconfirmAttendance(trainingId, user.id);
      setAttendance(getAttendanceByTraining(trainingId)); // Update state
    }
  };

  const handleSaveEdit = () => {
    if (!user || user.role !== "trainer") return;
    updateTraining(trainingId, {
      date: editForm.date,
      time: editForm.time,
      location: editForm.location,
      description: editForm.description,
    });
    setShowEditModal(false);
  };

  const handleDelete = () => {
    if (!user || user.role !== "trainer") return;
    deleteTraining(trainingId);
    setShowDeleteModal(false);
    navigation.goBack();
  };

  const confirmedUsers = attendance.confirmed.map((id) =>
    mockUsers.find((u) => u.id === id)
  );
  const notConfirmedUsers = attendance.notConfirmed.map((id) =>
    mockUsers.find((u) => u.id === id)
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{training.teamName}</Text>
        </View>

        {/* Trainer Actions */}
        {user?.role === "trainer" && user?.id === training.trainerId && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => setShowEditModal(true)}
            >
              <MaterialCommunityIcons name="pencil" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Upraviť</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => setShowDeleteModal(true)}
            >
              <MaterialCommunityIcons name="trash-can" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Zmazať</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Training Info Card */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={18} color="#666" />
            <Text style={styles.infoText}>{formatDate(training.date)}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock" size={18} color="#666" />
            <Text style={styles.infoText}>{training.time}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={18} color="#666" />
            <Text style={styles.infoText}>{training.location}</Text>
          </View>
          {training.recurrence && training.recurrence !== "none" && (
            <View style={styles.recurrenceTag}>
              <Text style={styles.recurrenceText}>
                Opakuje sa: {getRecurrenceText(training.recurrence)}
              </Text>
            </View>
          )}
        </View>

        {/* Training Content Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Náplň tréningu</Text>
          <Text style={styles.description}>{training.description}</Text>
        </View>

        {/* Attendance Buttons (only for players/parents) */}
        {(user?.role === "player" || user?.role === "parent") && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Prídem</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.unconfirmButton}
              onPress={handleUnconfirm}
            >
              <Text style={styles.unconfirmButtonText}>Neprídem</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Attendance List */}
        <View style={styles.card}>
          <View style={styles.attendanceHeader}>
            <MaterialCommunityIcons name="account-multiple" size={20} color="#666" />
            <Text style={styles.cardTitle}>Účasť</Text>
          </View>

          {/* Confirmed */}
          <Text style={styles.attendanceSubtitle}>
            Prídu ({confirmedUsers.length})
          </Text>
          {confirmedUsers.map((user) => (
            <View key={user?.id} style={styles.userRow}>
              <View style={[styles.avatar, styles.avatarConfirmed]}>
                <Text style={styles.avatarText}>{getInitials(user)}</Text>
              </View>
              <Text style={styles.userName}>
                {user?.firstName} {user?.lastName}
              </Text>
            </View>
          ))}

          {/* Not Confirmed */}
          <Text style={[styles.attendanceSubtitle, { marginTop: 16 }]}>
            Nepotvrdili ({notConfirmedUsers.length})
          </Text>
          {notConfirmedUsers.map((user) => (
            <View key={user?.id} style={styles.userRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(user)}</Text>
              </View>
              <Text style={styles.userName}>
                {user?.firstName} {user?.lastName}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        transparent
        visible={showEditModal}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upraviť tréning</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Dátum</Text>
              <TextInput
                style={styles.modalInput}
                value={editForm.date}
                onChangeText={(v) => setEditForm({ ...editForm, date: v })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
              />

              <Text style={styles.inputLabel}>Čas</Text>
              <TextInput
                style={styles.modalInput}
                value={editForm.time}
                onChangeText={(v) => setEditForm({ ...editForm, time: v })}
                placeholder="HH:MM"
                placeholderTextColor="#999"
              />

              <Text style={styles.inputLabel}>Miesto</Text>
              <TextInput
                style={styles.modalInput}
                value={editForm.location}
                onChangeText={(v) => setEditForm({ ...editForm, location: v })}
                placeholder="Názov lokácie"
                placeholderTextColor="#999"
              />

              <Text style={styles.inputLabel}>Popis</Text>
              <TextInput
                style={[styles.modalInput, { height: 100, textAlignVertical: "top" }]}
                value={editForm.description}
                onChangeText={(v) => setEditForm({ ...editForm, description: v })}
                multiline
                numberOfLines={4}
                placeholder="Obsah tréningu"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancel]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalCancelText}>Zrušiť</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSave]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.modalSaveText}>Uložiť</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        transparent
        visible={showDeleteModal}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmContent}>
            <Text style={styles.confirmTitle}>Zmazať tréning?</Text>
            <Text style={styles.confirmText}>Táto akcia je nezvratná.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancel]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalCancelText}>Nie</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalDelete]}
                onPress={handleDelete}
              >
                <Text style={styles.modalDeleteText}>Áno, zmazať</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNav navigation={navigation} active="TrainingList" />
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
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    color: "#333",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 0,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: "#2196F3",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 20,
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
  },
  recurrenceTag: {
    alignSelf: "flex-start",
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
  },
  recurrenceText: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "500",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: "row",
    margin: 20,
    marginTop: 16,
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  unconfirmButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  unconfirmButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  attendanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  attendanceSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
    marginBottom: 8,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
  avatarConfirmed: {
    backgroundColor: "#C8E6C9",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2196F3",
  },
  userName: {
    fontSize: 16,
    color: "#333",
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
    paddingBottom: 16,
    overflow: "hidden",
  },
  confirmContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  modalInput: {
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 15,
    color: "#333",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  modalCancel: {
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  modalSave: {
    borderColor: "#2196F3",
    backgroundColor: "#2196F3",
  },
  modalDelete: {
    borderColor: "#f44336",
    backgroundColor: "#f44336",
  },
  modalCancelText: {
    color: "#333",
    fontWeight: "600",
  },
  modalSaveText: {
    color: "#fff",
    fontWeight: "700",
  },
  modalDeleteText: {
    color: "#fff",
    fontWeight: "700",
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  confirmText: {
    fontSize: 14,
    color: "#666",
  },
});
