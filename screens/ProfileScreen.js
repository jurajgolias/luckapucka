import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput } from "react-native";
import { useUser } from "../context/UserContext";
import BottomNav from "../components/BottomNav";

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateUser } = useUser();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    age: user?.age ? String(user.age) : "",
    password: "",
  });
  const [error, setError] = React.useState("");

  const getRoleName = (role) => {
    const roles = {
      admin: "Administrátor",
      manager: "Manažér",
      trainer: "Tréner",
      player: "Hráč",
    };
    return roles[role] || role;
  };

  const getInitials = () => {
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
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials()}</Text>
            </View>
            <Text style={styles.name}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.role}>{getRoleName(user?.role)}</Text>
          </View>
        </View>

        {/* Profile Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informácie o profile</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vek</Text>
            <Text style={styles.infoValue}>{user?.age} rokov</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Počet tímov</Text>
            <Text style={styles.infoValue}>{user?.teams || 0}</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nastavenia</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔔</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Notifikácie</Text>
                <Text style={styles.settingDescription}>
                  Dostávať upozornenia
                </Text>
              </View>
            </View>
            <Switch
              value={Boolean(notificationsEnabled)}
              onValueChange={(val) => setNotificationsEnabled(Boolean(val))}
              trackColor={{ false: "#ccc", true: "#2196F3" }}
            />
          </View>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => {
              setIsEditing(true);
              setError("");
            }}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>⚙️</Text>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Upraviť profil</Text>
                <Text style={styles.settingDescription}>
                  Zmeniť osobné údaje
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {isEditing && (
            <View style={styles.editFormContainer}>
              <Text style={styles.editFormTitle}>Upraviť profil</Text>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
                  placeholder="vase@email.sk"
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
                    placeholder="25"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Nové heslo (voliteľné)</Text>
                  <TextInput
                    style={styles.input}
                    value={editForm.password}
                    onChangeText={(text) => setEditForm({ ...editForm, password: text })}
                    placeholder="Ponechajte prázdne"
                    placeholderTextColor="#999"
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={[styles.saveButton, styles.buttonNarrow]}
                  onPress={() => {
                    if (!editForm.firstName.trim() || !editForm.lastName.trim() || !editForm.email.trim()) {
                      setError("Vyplňte všetky povinné polia");
                      return;
                    }
                    updateUser({
                      firstName: editForm.firstName.trim(),
                      lastName: editForm.lastName.trim(),
                      email: editForm.email.trim().toLowerCase(),
                      age: editForm.age ? Number(editForm.age) : user?.age,
                      password: editForm.password || user?.password,
                    });
                    setIsEditing(false);
                    setError("");
                  }}
                >
                  <Text style={styles.saveButtonText}>Uložiť</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cancelButton, styles.buttonNarrow]}
                  onPress={() => {
                    setIsEditing(false);
                    setError("");
                    setEditForm({
                      firstName: user?.firstName || "",
                      lastName: user?.lastName || "",
                      email: user?.email || "",
                      age: user?.age ? String(user.age) : "",
                      password: "",
                    });
                  }}
                >
                  <Text style={styles.cancelButtonText}>Zrušiť</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }}
        >
          <Text style={styles.logoutButtonText}>→ Odhlásiť sa</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav navigation={navigation} active="Profile" />
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
    backgroundColor: "#2196F3",
    paddingTop: 60,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2196F3",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: "#E3F2FD",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#f44336",
  },
  logoutButtonText: {
    color: "#f44336",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  editFormContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  editFormTitle: {
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
  formActions: {
    flexDirection: "row",
    marginTop: 8,
  },
  buttonNarrow: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
  },
});
