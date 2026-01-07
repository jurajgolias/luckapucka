import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { addUser } from "../models/users";
import { useUser } from "../context/UserContext";

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useUser();

  const handleRegister = () => {
    setError("");

    // Validácia
    if (!firstName.trim()) {
      setError("Prosím vyplňte meno");
      return;
    }
    if (!lastName.trim()) {
      setError("Prosím vyplňte priezvisko");
      return;
    }
    if (!age.trim() || isNaN(age) || parseInt(age) < 1) {
      setError("Prosím zadajte platný vek");
      return;
    }
    if (!email.trim()) {
      setError("Prosím vyplňte email");
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError("Heslo musí mať aspoň 6 znakov");
      return;
    }

    // Vytvorenie používateľa
    const newUser = addUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      age: parseInt(age),
      password: password,
      role: "player",
      teams: 0,
    });

    if (newUser) {
      // Automatické prihlásenie
      login(newUser);
      navigation.reset({
        index: 0,
        routes: [{ name: "TrainingList" }],
      });
    } else {
      setError("Registrácia zlyhala. Skúste to znova.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      enabled={Platform.OS === "ios"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <MaterialCommunityIcons name="account" size={60} color="#fff" />
            </View>
            <Text style={styles.appName}>TeamAssistant</Text>
            <Text style={styles.heading}>Vytvorte si nový účet</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Meno</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Priezvisko</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Vek</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                placeholderTextColor="#999"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Heslo</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCorrect={false}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Registrovať</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.loginLinkText}>Už mám účet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2196F3",
    marginBottom: 8,
  },
  heading: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemActive: {
    backgroundColor: "#E3F2FD",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownItemTextActive: {
    color: "#2196F3",
    fontWeight: "600",
  },
  errorText: {
    color: "#f44336",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  registerButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLink: {
    alignItems: "center",
    marginTop: 24,
  },
  loginLinkText: {
    fontSize: 14,
    color: "#333",
    textDecorationLine: "underline",
  },
});
