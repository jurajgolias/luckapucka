import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";
import { getTeamsByTrainer } from "../models/teams";
import BottomNav from "../components/BottomNav";

export default function TrainerTeamsScreen({ navigation }) {
  const { user } = useUser();
  const teams = getTeamsByTrainer(user?.id || 0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="account-group" size={40} color="#666" />
          <Text style={styles.title}>Moje tímy</Text>
        </View>

        {/* Teams List */}
        <View style={styles.content}>
          {teams.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="clipboard-list" size={64} color="#999" />
              <Text style={styles.emptyStateText}>Zatiaľ nemáte priradené žiadne tímy</Text>
            </View>
          ) : (
            teams.map((team) => (
              <TouchableOpacity 
                key={team.id} 
                style={styles.card}
                onPress={() => navigation.navigate("TeamDetail", { team })}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{team.name}</Text>
                  <Text style={styles.cardSubtitle}>{team.sport}</Text>
                  <Text style={styles.cardInfo}>{team.members} členov</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} />
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
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  content: {
    padding: 20,
  },
  card: {
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});
