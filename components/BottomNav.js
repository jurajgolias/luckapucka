import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";

export default function BottomNav({ navigation, active }) {
  const { user } = useUser();
  const isManagerOrAdmin = user?.role === "manager" || user?.role === "admin";
  const isAdmin = user?.role === "admin";
  const isTrainer = user?.role === "trainer";

  const items = [
    { key: "TrainingList", label: "Tréningy", icon: "calendar-month", show: !isAdmin },
    { key: "TrainerTeams", label: "Moje tímy", icon: "account-group", show: isTrainer },
    { key: "ManagerDashboard", label: "Dashboard", icon: "account-multiple", show: user?.role === "manager" },
    { key: "AdminDashboard", label: "Admin", icon: "cog", show: isAdmin },
    { key: "Messages", label: "Správy", icon: "chat", show: true },
    { key: "Profile", label: "Profil", icon: "account", show: true },
  ];

  return (
    <View style={styles.bottomNav}>
      {items
        .filter((item) => item.show)
        .map((item, index) => {
          const isActive = active === item.key;
          return (
            <TouchableOpacity
              key={`${item.key}-${index}`}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => navigation.navigate(item.key)}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={isActive ? "#2196F3" : "#666"}
              />
              <Text
                style={[styles.navLabel, isActive && styles.navLabelActive]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
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
  navItemActive: {
    // Active state placeholder
  },
  navLabel: {
    fontSize: 12,
    color: "#666",
  },
  navLabelActive: {
    color: "#2196F3",
    fontWeight: "600",
  },
});
