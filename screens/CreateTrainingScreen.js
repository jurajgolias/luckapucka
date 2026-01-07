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
import { mockTeams, getTeamsByTrainer } from "../models/teams";
import { addTraining } from "../models/trainings";

export default function CreateTrainingScreen({ navigation, route }) {
  const { user } = useUser();
  const trainingToEdit = route?.params?.training;

  // Filtrujem tímy - tréner vidí len svoje tímy
  const availableTeams = user?.role === "trainer" 
    ? getTeamsByTrainer(user.id)
    : mockTeams;

  const [team, setTeam] = useState(
    trainingToEdit?.teamName || (availableTeams[0]?.name || "Futbal U16")
  );
  const [date, setDate] = useState(trainingToEdit?.date || "");
  const [time, setTime] = useState(trainingToEdit?.time || "");
  const [location, setLocation] = useState(
    trainingToEdit?.location || ""
  );
  const [recurrence, setRecurrence] = useState(
    trainingToEdit?.recurrence || "none"
  );
  const [description, setDescription] = useState(
    trainingToEdit?.description || ""
  );
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [showRecurrenceDropdown, setShowRecurrenceDropdown] = useState(false);

  const recurrenceOptions = [
    { value: "none", label: "Bez opakovania" },
    { value: "daily", label: "Denne" },
    { value: "weekly", label: "Týždenne" },
    { value: "monthly", label: "Mesačne" },
  ];

  const handleSave = () => {
    if (!team || !date || !time || !location || !description) {
      alert("Prosím vyplňte všetky povinné polia");
      return;
    }

    const teamData = mockTeams.find((t) => t.name === team);
    const trainingData = {
      teamId: teamData?.id || 1,
      teamName: team,
      date: date,
      time: time,
      location: location,
      description: description,
      recurrence: recurrence,
      trainerId: user?.id || 2,
    };

    if (trainingToEdit) {
      // TODO: Update training
      console.log("Update training", trainingToEdit.id, trainingData);
    } else {
      addTraining(trainingData);
    }

    navigation.goBack();
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
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {trainingToEdit ? "Upraviť tréning" : "Nový tréning"}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Team */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tím</Text>
            <TouchableOpacity
              style={styles.selectContainer}
              onPress={() => setShowTeamDropdown((p) => !p)}
              activeOpacity={0.8}
            >
              <Text style={styles.selectValue}>{team}</Text>
              <MaterialCommunityIcons
                name={showTeamDropdown ? "chevron-up" : "chevron-down"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
            {showTeamDropdown && (
              <View style={styles.dropdownMenu}>
                {availableTeams.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setTeam(t.name);
                      setShowTeamDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{t.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Date */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dátum</Text>
            <View style={styles.rowInput}>
              <MaterialCommunityIcons name="calendar" size={20} color="#666" />
              <TextInput
                style={styles.textInputInline}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#999"
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>

          {/* Time */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Čas</Text>
            <View style={styles.rowInput}>
              <MaterialCommunityIcons name="clock" size={20} color="#666" />
              <TextInput
                style={styles.textInputInline}
                value={time}
                onChangeText={setTime}
                placeholder="HH:MM"
                placeholderTextColor="#999"
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>

          {/* Location */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Miesto</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="napr. Hlavné ihrisko"
              autoCorrect={false}
            />
          </View>

          {/* Recurrence */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Opakovanie</Text>
            <TouchableOpacity
              style={styles.selectContainer}
              onPress={() => setShowRecurrenceDropdown((p) => !p)}
              activeOpacity={0.8}
            >
              <Text style={styles.selectValue}>
                {recurrenceOptions.find((r) => r.value === recurrence)?.label ||
                  "Bez opakovania"}
              </Text>
              <MaterialCommunityIcons
                name={showRecurrenceDropdown ? "chevron-up" : "chevron-down"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
            {showRecurrenceDropdown && (
              <View style={styles.dropdownMenu}>
                {recurrenceOptions.map((r) => (
                  <TouchableOpacity
                    key={r.value}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setRecurrence(r.value);
                      setShowRecurrenceDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{r.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Náplň tréningu</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Opíšte plán tréningu..."
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              autoCorrect={false}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Zrušiť</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleSave}
            >
              <Text style={styles.createButtonText}>
                {trainingToEdit ? "Uložiť" : "Vytvoriť"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("TrainingList")}
        >
          <MaterialCommunityIcons name="calendar-month" size={24} color="#666" />
          <Text style={styles.navLabel}>Tréningy</Text>
        </TouchableOpacity>
        {(user?.role === "manager" || user?.role === "admin") && (
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate("ManagerDashboard")}
          >
            <Text style={styles.navIcon}>👥</Text>
            <Text style={styles.navLabel}>Dashboard</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Messages")}
        >
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navLabel}>Správy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.navIcon}>👤</Text>
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
  form: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectValue: {
    fontSize: 16,
    color: "#333",
  },
  rowInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    gap: 10,
  },
  textInputInline: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
  },
  dropdownMenu: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f4",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  createButton: {
    flex: 1,
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginLeft: 8,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 12,
    color: "#666",
  },
});
