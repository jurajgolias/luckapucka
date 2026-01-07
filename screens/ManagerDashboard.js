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
import { mockTeams, addTeam, updateTeam, deleteTeam } from "../models/teams";
import { mockUsers, addUser, updateExistingUser, deleteUser } from "../models/users";
import BottomNav from "../components/BottomNav";

export default function ManagerDashboard({ navigation }) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("teams");
  const isManager = user?.role === "manager";

  const [teams, setTeams] = useState(mockTeams);
  const [users, setUsers] = useState(mockUsers);

  const [showAddTeamForm, setShowAddTeamForm] = useState(false);
  const [teamForm, setTeamForm] = useState({ name: "", sport: "", members: "", trainerId: "" });
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editTeamForm, setEditTeamForm] = useState({ name: "", sport: "", members: "", trainerId: "" });

  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [userForm, setUserForm] = useState({ firstName: "", lastName: "", email: "", age: "", password: "", role: "player" });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserForm, setEditUserForm] = useState({ firstName: "", lastName: "", email: "", age: "", password: "", role: "player" });

  const [error, setError] = useState("");

  const getInitials = (user) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return "U";
  };

  const getRoleName = (role) => {
    const roles = {
      admin: "Admin",
      manager: "Manažér",
      trainer: "Tréner",
      player: "Hráč/Rodič",
    };
    return roles[role] || role;
  };

  const handleAddTeam = () => {
    if (!teamForm.name.trim() || !teamForm.sport.trim()) {
      setError("Vyplňte názov a šport tímu");
      return;
    }
    addTeam({
      name: teamForm.name.trim(),
      sport: teamForm.sport.trim(),
      members: teamForm.members,
      trainerId: teamForm.trainerId ? Number(teamForm.trainerId) : 2,
    });
    setTeams([...mockTeams]);
    setTeamForm({ name: "", sport: "", members: "", trainerId: "" });
    setError("");
    setShowAddTeamForm(false);
  };

  const handleStartEditTeam = (team) => {
    setError("");
    setShowAddTeamForm(false);
    setEditingTeamId(team.id);
    setEditTeamForm({
      name: team.name,
      sport: team.sport,
      members: String(team.members ?? ""),
      trainerId: String(team.trainerId ?? ""),
    });
  };

  const handleUpdateTeam = () => {
    if (!editingTeamId) return;
    if (!editTeamForm.name.trim() || !editTeamForm.sport.trim()) {
      setError("Vyplňte názov a šport tímu");
      return;
    }
    updateTeam({
      id: editingTeamId,
      name: editTeamForm.name.trim(),
      sport: editTeamForm.sport.trim(),
      members: editTeamForm.members,
      trainerId: editTeamForm.trainerId ? Number(editTeamForm.trainerId) : 2,
    });
    setTeams([...mockTeams]);
    setEditingTeamId(null);
    setEditTeamForm({ name: "", sport: "", members: "", trainerId: "" });
    setError("");
  };

  const handleDeleteTeam = (id) => {
    deleteTeam(id);
    setTeams([...mockTeams]);
    if (editingTeamId === id) {
      setEditingTeamId(null);
      setEditTeamForm({ name: "", sport: "", members: "", trainerId: "" });
    }
    setError("");
  };

  const handleAddUser = () => {
    const trimmedEmail = userForm.email.trim().toLowerCase();
    if (!userForm.firstName.trim() || !userForm.lastName.trim() || !trimmedEmail) {
      setError("Vyplňte meno, priezvisko a email");
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      setError("Používateľ s týmto emailom už existuje");
      return;
    }
    addUser({
      firstName: userForm.firstName.trim(),
      lastName: userForm.lastName.trim(),
      email: trimmedEmail,
      age: userForm.age,
      password: userForm.password || "user123",
      role: userForm.role,
    });
    setUsers([...mockUsers]);
    setUserForm({ firstName: "", lastName: "", email: "", age: "", password: "", role: "player" });
    setError("");
    setShowAddUserForm(false);
  };

  const handleStartEditUser = (userItem) => {
    setError("");
    setShowAddUserForm(false);
    setEditingUserId(userItem.id);
    setEditUserForm({
      firstName: userItem.firstName,
      lastName: userItem.lastName,
      email: userItem.email,
      age: String(userItem.age ?? ""),
      password: userItem.password || "",
      role: userItem.role,
    });
  };

  const handleUpdateUser = () => {
    if (!editingUserId) return;
    const trimmedEmail = editUserForm.email.trim().toLowerCase();
    if (!editUserForm.firstName.trim() || !editUserForm.lastName.trim() || !trimmedEmail) {
      setError("Vyplňte meno, priezvisko a email");
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === trimmedEmail && u.id !== editingUserId)) {
      setError("Používateľ s týmto emailom už existuje");
      return;
    }
    updateExistingUser({
      id: editingUserId,
      firstName: editUserForm.firstName.trim(),
      lastName: editUserForm.lastName.trim(),
      email: trimmedEmail,
      age: editUserForm.age,
      password: editUserForm.password,
      role: editUserForm.role,
    });
    setUsers([...mockUsers]);
    setEditingUserId(null);
    setEditUserForm({ firstName: "", lastName: "", email: "", age: "", password: "", role: "player" });
    setError("");
  };

  const handleDeleteUser = (id) => {
    deleteUser(id);
    setUsers([...mockUsers]);
    if (editingUserId === id) {
      setEditingUserId(null);
      setEditUserForm({ firstName: "", lastName: "", email: "", age: "", password: "", role: "player" });
    }
    setError("");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="shield" size={40} color="#666" />
          <Text style={styles.title}>Dashboard manažéra</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "teams" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("teams")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "teams" && styles.tabTextActive,
              ]}
            >
              Tímy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "users" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("users")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "users" && styles.tabTextActive,
              ]}
            >
              Používatelia
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === "teams" ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {teams.length} tímov
                </Text>
                {isManager && (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      setError("");
                      setShowAddTeamForm((prev) => !prev);
                    }}
                  >
                    <Text style={styles.addButtonText}>
                      {showAddTeamForm ? "Zrušiť" : "+ Pridať tím"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {error && activeTab === "teams" ? <Text style={styles.errorText}>{error}</Text> : null}

              {showAddTeamForm && (
                <View style={styles.formContainer}>
                  <Text style={styles.formTitle}>Nový tím</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Názov tímu</Text>
                    <TextInput
                      style={styles.input}
                      value={teamForm.name}
                      onChangeText={(text) => setTeamForm({ ...teamForm, name: text })}
                      placeholder="Futbal U16"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Šport</Text>
                    <TextInput
                      style={styles.input}
                      value={teamForm.sport}
                      onChangeText={(text) => setTeamForm({ ...teamForm, sport: text })}
                      placeholder="Futbal"
                      placeholderTextColor="#999"
                    />
                  </View>
                  <View style={styles.formRow}>
                    <View style={[styles.inputWrapper, styles.inputSpacing]}>
                      <Text style={styles.inputLabel}>Počet členov</Text>
                      <TextInput
                        style={styles.input}
                        value={teamForm.members}
                        onChangeText={(text) => setTeamForm({ ...teamForm, members: text })}
                        placeholder="0"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Tréner</Text>
                      <View style={styles.pickerWrapper}>
                        {users.filter(u => u.role === "trainer").map((trainer) => (
                          <TouchableOpacity
                            key={trainer.id}
                            style={[
                              styles.trainerOption,
                              teamForm.trainerId === String(trainer.id) && styles.trainerOptionActive,
                            ]}
                            onPress={() => setTeamForm({ ...teamForm, trainerId: String(trainer.id) })}
                          >
                            <Text
                              style={[
                                styles.trainerOptionText,
                                teamForm.trainerId === String(trainer.id) && styles.trainerOptionTextActive,
                              ]}
                            >
                              {trainer.firstName} {trainer.lastName}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.saveButton} onPress={handleAddTeam}>
                    <Text style={styles.saveButtonText}>Uložiť tím</Text>
                  </TouchableOpacity>
                </View>
              )}

              {teams.map((team) => {
                const trainer = users.find(u => u.id === team.trainerId);
                const trainerName = trainer ? `${trainer.firstName} ${trainer.lastName}` : "Nezadaný";
                return (
                  <View key={team.id}>
                    <View style={styles.card}>
                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{team.name}</Text>
                        <Text style={styles.cardSubtitle}>{team.sport}</Text>
                        <Text style={styles.cardInfo}>
                          {team.members} členov • Tréner: {trainerName}
                        </Text>
                      </View>
                      {isManager && (
                        <View style={styles.cardActions}>
                          <TouchableOpacity style={styles.editButton} onPress={() => handleStartEditTeam(team)}>
                            <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTeam(team.id)}>
                            <MaterialCommunityIcons name="trash-can" size={20} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                  {editingTeamId === team.id && (
                    <View style={styles.formContainer}>
                      <Text style={styles.formTitle}>Upraviť tím</Text>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Názov tímu</Text>
                        <TextInput
                          style={styles.input}
                          value={editTeamForm.name}
                          onChangeText={(text) => setEditTeamForm({ ...editTeamForm, name: text })}
                          placeholder="Futbal U16"
                          placeholderTextColor="#999"
                        />
                      </View>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Šport</Text>
                        <TextInput
                          style={styles.input}
                          value={editTeamForm.sport}
                          onChangeText={(text) => setEditTeamForm({ ...editTeamForm, sport: text })}
                          placeholder="Futbal"
                          placeholderTextColor="#999"
                        />
                      </View>
                      <View style={styles.formRow}>
                        <View style={[styles.inputWrapper, styles.inputSpacing]}>
                          <Text style={styles.inputLabel}>Počet členov</Text>
                          <TextInput
                            style={styles.input}
                            value={editTeamForm.members}
                            onChangeText={(text) => setEditTeamForm({ ...editTeamForm, members: text })}
                            placeholder="0"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                          />
                        </View>
                        <View style={styles.inputWrapper}>
                          <Text style={styles.inputLabel}>Tréner</Text>
                          <View style={styles.pickerWrapper}>
                            {users.filter(u => u.role === "trainer").map((trainer) => (
                              <TouchableOpacity
                                key={trainer.id}
                                style={[
                                  styles.trainerOption,
                                  editTeamForm.trainerId === String(trainer.id) && styles.trainerOptionActive,
                                ]}
                                onPress={() => setEditTeamForm({ ...editTeamForm, trainerId: String(trainer.id) })}
                              >
                                <Text
                                  style={[
                                    styles.trainerOptionText,
                                    editTeamForm.trainerId === String(trainer.id) && styles.trainerOptionTextActive,
                                  ]}
                                >
                                  {trainer.firstName} {trainer.lastName}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      </View>
                      <View style={styles.formActions}>
                        <TouchableOpacity
                          style={[styles.saveButton, styles.buttonNarrow]}
                          onPress={handleUpdateTeam}
                        >
                          <Text style={styles.saveButtonText}>Uložiť</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.cancelButton, styles.buttonNarrow]}
                          onPress={() => {
                            setEditingTeamId(null);
                            setEditTeamForm({ name: "", sport: "", members: "", trainerId: "" });
                            setError("");
                          }}
                        >
                          <Text style={styles.cancelButtonText}>Zrušiť</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
                );
              })}
            </>
          ) : (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {users.filter((u) => u.role === "trainer" || u.role === "player").length} používateľov
                </Text>
                {isManager && (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      setError("");
                      setShowAddUserForm((prev) => !prev);
                    }}
                  >
                    <Text style={styles.addButtonText}>
                      {showAddUserForm ? "Zrušiť" : "+ Pridať používateľa"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {error && activeTab === "users" ? <Text style={styles.errorText}>{error}</Text> : null}

              {showAddUserForm && (
                <View style={styles.formContainer}>
                  <Text style={styles.formTitle}>Nový používateľ</Text>
                  <View style={styles.formRow}>
                    <View style={[styles.inputWrapper, styles.inputSpacing]}>
                      <Text style={styles.inputLabel}>Meno</Text>
                      <TextInput
                        style={styles.input}
                        value={userForm.firstName}
                        onChangeText={(text) => setUserForm({ ...userForm, firstName: text })}
                        placeholder="Meno"
                        placeholderTextColor="#999"
                      />
                    </View>
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Priezvisko</Text>
                      <TextInput
                        style={styles.input}
                        value={userForm.lastName}
                        onChangeText={(text) => setUserForm({ ...userForm, lastName: text })}
                        placeholder="Priezvisko"
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                      style={styles.input}
                      value={userForm.email}
                      onChangeText={(text) => setUserForm({ ...userForm, email: text })}
                      placeholder="email@example.com"
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
                        value={userForm.age}
                        onChangeText={(text) => setUserForm({ ...userForm, age: text })}
                        placeholder="25"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.inputWrapper}>
                      <Text style={styles.inputLabel}>Heslo</Text>
                      <TextInput
                        style={styles.input}
                        value={userForm.password}
                        onChangeText={(text) => setUserForm({ ...userForm, password: text })}
                        placeholder="user123"
                        placeholderTextColor="#999"
                        secureTextEntry
                      />
                    </View>
                  </View>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Rola</Text>
                    <View style={styles.roleSelector}>
                      {["player", "trainer"].map((role) => (
                        <TouchableOpacity
                          key={role}
                          style={[
                            styles.roleOption,
                            userForm.role === role && styles.roleOptionActive,
                          ]}
                          onPress={() => setUserForm({ ...userForm, role })}
                        >
                          <Text
                            style={[
                              styles.roleOptionText,
                              userForm.role === role && styles.roleOptionTextActive,
                            ]}
                          >
                            {role === "player" ? "Hráč" : "Tréner"}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <TouchableOpacity style={styles.saveButton} onPress={handleAddUser}>
                    <Text style={styles.saveButtonText}>Uložiť používateľa</Text>
                  </TouchableOpacity>
                </View>
              )}

              {users
                .filter((u) => u.role === "trainer" || u.role === "player")
                .map((userItem) => (
                <View key={userItem.id}>
                  <View style={styles.card}>
                    <View style={styles.userAvatar}>
                      <Text style={styles.userAvatarText}>
                        {getInitials(userItem)}
                      </Text>
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>
                        {userItem.firstName} {userItem.lastName}
                      </Text>
                      <Text style={styles.cardSubtitle}>{userItem.email}</Text>
                      <View style={styles.userInfo}>
                        <View style={styles.roleTag}>
                          <Text style={styles.roleTagText}>
                            {getRoleName(userItem.role)}
                          </Text>
                        </View>
                        <Text style={styles.cardInfo}>
                          {userItem.age} rokov
                        </Text>
                      </View>
                    </View>
                    {isManager && (
                      <View style={styles.cardActions}>
                        <TouchableOpacity style={styles.editButton} onPress={() => handleStartEditUser(userItem)}>
                          <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteUser(userItem.id)}>
                          <MaterialCommunityIcons name="trash-can" size={20} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {editingUserId === userItem.id && (
                    <View style={styles.formContainer}>
                      <Text style={styles.formTitle}>Upraviť používateľa</Text>
                      <View style={styles.formRow}>
                        <View style={[styles.inputWrapper, styles.inputSpacing]}>
                          <Text style={styles.inputLabel}>Meno</Text>
                          <TextInput
                            style={styles.input}
                            value={editUserForm.firstName}
                            onChangeText={(text) => setEditUserForm({ ...editUserForm, firstName: text })}
                            placeholder="Meno"
                            placeholderTextColor="#999"
                          />
                        </View>
                        <View style={styles.inputWrapper}>
                          <Text style={styles.inputLabel}>Priezvisko</Text>
                          <TextInput
                            style={styles.input}
                            value={editUserForm.lastName}
                            onChangeText={(text) => setEditUserForm({ ...editUserForm, lastName: text })}
                            placeholder="Priezvisko"
                            placeholderTextColor="#999"
                          />
                        </View>
                      </View>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                          style={styles.input}
                          value={editUserForm.email}
                          onChangeText={(text) => setEditUserForm({ ...editUserForm, email: text })}
                          placeholder="email@example.com"
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
                            value={editUserForm.age}
                            onChangeText={(text) => setEditUserForm({ ...editUserForm, age: text })}
                            placeholder="25"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                          />
                        </View>
                        <View style={styles.inputWrapper}>
                          <Text style={styles.inputLabel}>Heslo</Text>
                          <TextInput
                            style={styles.input}
                            value={editUserForm.password}
                            onChangeText={(text) => setEditUserForm({ ...editUserForm, password: text })}
                            placeholder="Ponechajte prázdne"
                            placeholderTextColor="#999"
                            secureTextEntry
                          />
                        </View>
                      </View>
                      <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Rola</Text>
                        <View style={styles.roleSelector}>
                          {["player", "trainer"].map((role) => (
                            <TouchableOpacity
                              key={role}
                              style={[
                                styles.roleOption,
                                editUserForm.role === role && styles.roleOptionActive,
                              ]}
                              onPress={() => setEditUserForm({ ...editUserForm, role })}
                            >
                              <Text
                                style={[
                                  styles.roleOptionText,
                                  editUserForm.role === role && styles.roleOptionTextActive,
                                ]}
                              >
                                {role === "player" ? "Hráč" : "Tréner"}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                      <View style={styles.formActions}>
                        <TouchableOpacity
                          style={[styles.saveButton, styles.buttonNarrow]}
                          onPress={handleUpdateUser}
                        >
                          <Text style={styles.saveButtonText}>Uložiť</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.cancelButton, styles.buttonNarrow]}
                          onPress={() => {
                            setEditingUserId(null);
                            setEditUserForm({ firstName: "", lastName: "", email: "", age: "", password: "", role: "player" });
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
            </>
          )}
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} active="ManagerDashboard" />
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
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#f0f0f0",
  },
  tabActive: {
    backgroundColor: "#fff",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
  },
  tabTextActive: {
    color: "#333",
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  card: {
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
    alignItems: "center",
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userAvatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2196F3",
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  cardInfo: {
    fontSize: 12,
    color: "#999",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  roleTag: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  roleTagText: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "500",
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#f44336",
    borderRadius: 6,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: "#2196F3",
    borderRadius: 6,
  },
  formContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
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
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  formActions: {
    flexDirection: "row",
    marginTop: 8,
  },
  buttonNarrow: {
    flex: 1,
    marginRight: 8,
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
  errorText: {
    color: "#f44336",
    fontSize: 13,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  roleSelector: {
    flexDirection: "row",
    gap: 8,
  },
  roleOption: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  roleOptionActive: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  roleOptionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  roleOptionTextActive: {
    color: "#2196F3",
    fontWeight: "600",
  },
  pickerWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  trainerOption: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  trainerOptionActive: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  trainerOptionText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  trainerOptionTextActive: {
    color: "#2196F3",
    fontWeight: "600",
  },
});
