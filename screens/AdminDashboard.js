import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";
import { mockUsers, addManager, updateManager, deleteManager } from "../models/users";
import BottomNav from "../components/BottomNav";

export default function AdminDashboard({ navigation }) {
  const { user } = useUser();
  const [users, setUsers] = useState(mockUsers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    password: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    password: "",
  });
  const [error, setError] = useState("");

  const isAdmin = user?.role === "admin";
  const managers = users.filter((u) => u.role === "manager");

  const resetForms = () => {
    setForm({ firstName: "", lastName: "", email: "", age: "", password: "" });
    setEditForm({ firstName: "", lastName: "", email: "", age: "", password: "" });
    setEditingId(null);
  };

  const handleAddManager = () => {
    if (!isAdmin) {
      setError("Len admin môže pridávať manažérov");
      return;
    }

    const trimmedEmail = form.email.trim().toLowerCase();
    if (!form.firstName.trim() || !form.lastName.trim() || !trimmedEmail) {
      setError("Vyplňte meno, priezvisko a email");
      return;
    }

    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      setError("Používateľ s týmto emailom už existuje");
      return;
    }

    addManager({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: trimmedEmail,
      age: form.age,
      password: form.password || "manazer123",
    });

    // Sync local state with mutated mock data to avoid duplicate entries
    setUsers([...mockUsers]);
    resetForms();
    setError("");
    setShowAddForm(false);
  };

  const handleStartEdit = (manager) => {
    if (!isAdmin) {
      setError("Len admin môže upravovať manažérov");
      return;
    }
    setError("");
    setShowAddForm(false);
    setEditingId(manager.id);
    setEditForm({
      firstName: manager.firstName,
      lastName: manager.lastName,
      email: manager.email,
      age: String(manager.age ?? ""),
      password: manager.password || "",
    });
  };

  const handleUpdateManager = () => {
    if (!isAdmin) {
      setError("Len admin môže upravovať manažérov");
      return;
    }
    if (!editingId) return;

    const trimmedEmail = editForm.email.trim().toLowerCase();
    if (!editForm.firstName.trim() || !editForm.lastName.trim() || !trimmedEmail) {
      setError("Vyplňte meno, priezvisko a email");
      return;
    }

    if (users.some((u) => u.email.toLowerCase() === trimmedEmail && u.id !== editingId)) {
      setError("Používateľ s týmto emailom už existuje");
      return;
    }

    updateManager({
      id: editingId,
      firstName: editForm.firstName.trim(),
      lastName: editForm.lastName.trim(),
      email: trimmedEmail,
      age: editForm.age,
      password: editForm.password,
    });

    setUsers([...mockUsers]);
    resetForms();
    setError("");
  };

  const handleDeleteManager = (id) => {
    if (!isAdmin) {
      setError("Len admin môže mazať manažérov");
      return;
    }

    deleteManager(id);
    setUsers([...mockUsers]);

    if (editingId === id) {
      resetForms();
    }

    setError("");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
        </View>

        <View style={styles.content}>
          {/* Manager Management */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Správa manažérov</Text>
              <Text style={styles.cardSubtitle}>{managers.length} manažérov</Text>
            </View>
            <TouchableOpacity
              style={[styles.addButton, !isAdmin && styles.addButtonDisabled]}
              onPress={() => {
                if (!isAdmin) {
                  setError("Len admin môže pridávať manažérov");
                  return;
                }
                setError("");
                setShowAddForm((prev) => !prev);
              }}
            >
              <Text style={styles.addButtonText}>
                {showAddForm ? "Zrušiť" : "+ Pridať"}
              </Text>
            </TouchableOpacity>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {showAddForm && (
              <View style={styles.formContainer}>
                <View style={styles.formRow}>
                  <View style={[styles.inputWrapper, styles.inputSpacing]}>
                    <Text style={styles.inputLabel}>Meno</Text>
                    <TextInput
                      style={styles.input}
                      value={form.firstName}
                      onChangeText={(text) => setForm({ ...form, firstName: text })}
                      placeholder="Zadajte meno"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Priezvisko</Text>
                    <TextInput
                      style={styles.input}
                      value={form.lastName}
                      onChangeText={(text) => setForm({ ...form, lastName: text })}
                      placeholder="Zadajte priezvisko"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={form.email}
                    onChangeText={(text) => setForm({ ...form, email: text })}
                    placeholder="manazer@ta.sk"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={[styles.inputWrapper, styles.inputSpacing]}>
                    <Text style={styles.inputLabel}>Vek</Text>
                    <TextInput
                      style={styles.input}
                      value={form.age}
                      onChangeText={(text) => setForm({ ...form, age: text })}
                      placeholder="38"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Heslo</Text>
                    <TextInput
                      style={styles.input}
                      value={form.password}
                      onChangeText={(text) => setForm({ ...form, password: text })}
                      placeholder="manazer123"
                      placeholderTextColor="#999"
                      secureTextEntry
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleAddManager}>
                  <Text style={styles.saveButtonText}>Uložiť manažéra</Text>
                </TouchableOpacity>
              </View>
            )}

            {managers.map((manager) => (
              <View key={manager.id}>
                <View style={styles.managerCard}>
                  <View style={styles.managerInfo}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {manager.firstName[0]}{manager.lastName[0]}
                      </Text>
                    </View>
                    <View style={styles.managerDetails}>
                      <Text style={styles.managerName}>
                        {manager.firstName} {manager.lastName}
                      </Text>
                      <Text style={styles.managerEmail}>{manager.email}</Text>
                      <View style={styles.roleTag}>
                        <Text style={styles.roleTagText}>Manažér</Text>
                      </View>
                      <Text style={styles.managerStats}>
                        {manager.age} rokov • {manager.teams} tímov
                      </Text>
                    </View>
                  </View>
                  <View style={styles.managerActions}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleStartEdit(manager)}>
                      <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
                    </TouchableOpacity>
                    <View style={{ width: 8 }} />
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteManager(manager.id)}>
                      <MaterialCommunityIcons name="trash-can" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>

                {editingId === manager.id && (
                  <View style={styles.formContainer}>
                    <View style={styles.formRow}>
                      <View style={[styles.inputWrapper, styles.inputSpacing]}>
                        <Text style={styles.inputLabel}>Meno</Text>
                        <TextInput
                          style={styles.input}
                          value={editForm.firstName}
                          onChangeText={(text) => setEditForm({ ...editForm, firstName: text })}
                          placeholder="Zadajte meno"
                          placeholderTextColor="#999"
                        />
                      </View>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Priezvisko</Text>
                        <TextInput
                          style={styles.input}
                          value={editForm.lastName}
                          onChangeText={(text) => setEditForm({ ...editForm, lastName: text })}
                          placeholder="Zadajte priezvisko"
                          placeholderTextColor="#999"
                        />
                      </View>
                    </View>

                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Email</Text>
                      <TextInput
                        style={styles.input}
                        value={editForm.email}
                        onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                        placeholder="manazer@ta.sk"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />
                    </View>

                    <View style={styles.formRow}>
                      <View style={[styles.inputWrapper, styles.inputSpacing]}>
                        <Text style={styles.inputLabel}>Vek</Text>
                        <TextInput
                          style={styles.input}
                          value={editForm.age}
                          onChangeText={(text) => setEditForm({ ...editForm, age: text })}
                          placeholder="38"
                          placeholderTextColor="#999"
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Heslo</Text>
                        <TextInput
                          style={styles.input}
                          value={editForm.password}
                          onChangeText={(text) => setEditForm({ ...editForm, password: text })}
                          placeholder="ponechajte prázdne pre pôvodné"
                          placeholderTextColor="#999"
                          secureTextEntry
                        />
                      </View>
                    </View>

                    <View style={styles.formActions}>
                      <TouchableOpacity style={[styles.saveButton, styles.saveButtonNarrow]} onPress={handleUpdateManager}>
                        <Text style={styles.saveButtonText}>Uložiť</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.cancelButton, styles.saveButtonNarrow]}
                        onPress={() => {
                          resetForms();
                          setError("");
                        }}
                      >
                        <Text style={styles.cancelButtonText}>Zrušiť</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* System Statistics */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Štatistiky systému</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statColumn}>
                <Text style={styles.statLabel}>Celkom používateľov</Text>
                <Text style={styles.statValue}>{users.length}</Text>
                <Text style={styles.statLabel}>Trénerov</Text>
                <Text style={styles.statValue}>
                  {users.filter((u) => u.role === "trainer").length}
                </Text>
              </View>
              <View style={styles.statColumn}>
                <Text style={styles.statLabel}>Manažérov</Text>
                <Text style={styles.statValue}>{managers.length}</Text>
                <Text style={styles.statLabel}>Hráčov</Text>
                <Text style={styles.statValue}>
                  {users.filter((u) => u.role === "player").length}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} active="AdminDashboard" />
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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    backgroundColor: "#9C27B0",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  managerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  managerInfo: {
    flexDirection: "row",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E1BEE7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7B1FA2",
  },
  managerDetails: {
    flex: 1,
  },
  managerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  managerEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  roleTag: {
    alignSelf: "flex-start",
    backgroundColor: "#E1BEE7",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  roleTagText: {
    fontSize: 12,
    color: "#7B1FA2",
    fontWeight: "500",
  },
  managerStats: {
    fontSize: 12,
    color: "#999",
  },
  managerActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: "#2196F3",
    borderRadius: 6,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#f44336",
    borderRadius: 6,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  statColumn: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  formContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
  },
  inputWrapper: {
    flex: 1,
    marginBottom: 12,
  },
  inputSpacing: {
    marginRight: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 14,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  saveButtonNarrow: {
    flex: 1,
    marginRight: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  addButtonDisabled: {
    backgroundColor: "#d1c4e9",
  },
  errorText: {
    color: "#f44336",
    fontSize: 13,
    marginBottom: 8,
  },
  formActions: {
    flexDirection: "row",
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },
});
