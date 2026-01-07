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
import { mockTrainings } from "../models/trainings";
import { getTeamsByTrainer } from "../models/teams";
import { getAttendanceByTraining } from "../models/attendance";
import { useFocusEffect } from "@react-navigation/native";
import BottomNav from "../components/BottomNav";

export default function TrainingListScreen({ navigation }) {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  // Získať tréningy podľa role
  const getTrainings = () => {
    if (user?.role === "trainer") {
      return mockTrainings.filter((t) => t.trainerId === user.id);
    }
    // Pre hráča/rodiča - iba tréningy tímov v ktorých je
    if (user?.role === "player") {
      if (!user?.teamIds || user.teamIds.length === 0) {
        return []; // Žiadne tréningy ak nie je v žiadnom tíme
      }
      return mockTrainings.filter((t) => user.teamIds.includes(t.teamId));
    }
    // Default - všetky tréningy
    return mockTrainings;
  };

  const trainings = getTrainings();
  const filteredTrainings = trainings.filter((training) =>
    training.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ["ne", "po", "ut", "st", "št", "pi", "so"];
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
    return `${days[date.getDay()]} ${date.getDate()}. ${months[date.getMonth()]}`;
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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Tréningy</Text>
            {user && (
              <Text style={styles.subtitle}>
                {user.firstName} {user.lastName}
              </Text>
            )}
          </View>
          {(user?.role === "trainer") && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("CreateTraining")}
            >
              <Text style={styles.addButtonText}>+ Pridať</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Hľadať tréningy..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
        </View>

        {/* Training List */}
        <View style={styles.content}>
          {filteredTrainings.map((training) => (
            <TouchableOpacity
              key={training.id}
              style={styles.trainingCard}
              onPress={() =>
                navigation.navigate("TrainingDetail", { trainingId: training.id })
              }
            >
              <Text style={styles.trainingTitle}>{training.teamName}</Text>
              <View style={styles.trainingInfo}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="calendar" size={18} color="#666" />
                  <Text style={styles.infoText}>
                    {formatDate(training.date)}
                  </Text>
                  <MaterialCommunityIcons name="clock" size={18} color="#666" />
                  <Text style={styles.infoText}>{training.time}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="map-marker" size={18} color="#666" />
                  <Text style={styles.infoText}>{training.location}</Text>
                </View>
                <Text style={styles.trainingDescription}>
                  {training.description}
                </Text>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="account-multiple" size={18} color="#666" />
                  <Text style={styles.infoText}>
                    {getAttendanceByTraining(training.id).confirmed.length} potvrdených
                  </Text>
                </View>
              </View>
              {training.recurrence && training.recurrence !== "none" && (
                <View style={styles.recurrenceTag}>
                  <Text style={styles.recurrenceText}>
                    {getRecurrenceText(training.recurrence)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
  trainingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trainingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2196F3",
    marginBottom: 12,
  },
  trainingInfo: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginRight: 16,
  },
  trainingDescription: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
    marginBottom: 8,
  },
  recurrenceTag: {
    alignSelf: "flex-end",
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
  },
  recurrenceText: {
    fontSize: 12,
    color: "#2196F3",
    fontWeight: "500",
  },
});
