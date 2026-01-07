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
import { authenticateUser } from "../models/users";
import { useUser } from "../context/UserContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useUser();

  const handleLogin = () => {
    setError("");
    
    if (!email || !password) {
      setError("Prosím vyplňte všetky polia");
      return;
    }

    const user = authenticateUser(email, password);
    
    if (user) {
      login(user);
      
      // Navigácia podľa role
      if (user.role === "admin") {
        navigation.reset({
          index: 0,
          routes: [{ name: "AdminDashboard" }],
        });
      } else if (user.role === "manager") {
        navigation.reset({
          index: 0,
          routes: [{ name: "ManagerDashboard" }],
        });
      } else if (user.role === "trainer") {
        navigation.reset({
          index: 0,
          routes: [{ name: "TrainingList" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "TrainingList" }],
        });
      }
    } else {
      setError("Nesprávny email alebo heslo");
    }
  };

  const handleAdminLogin = () => {
    const adminUser = authenticateUser("admin@ta.sk", "admin123");
    if (adminUser) {
      login(adminUser);
      navigation.reset({
        index: 0,
        routes: [{ name: "AdminDashboard" }],
      });
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register");
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
              <Text style={styles.logoIcon}>👤</Text>
            </View>
            <Text style={styles.appName}>TeamAssistant</Text>
            <Text style={styles.heading}>Prihláste sa do svojho účtu</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Zadajte email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCorrect={false}
                editable={true}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Heslo</Text>
              <TextInput
                style={styles.input}
                placeholder="Zadajte heslo"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCorrect={false}
                editable={true}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Prihlásiť sa</Text>
            </TouchableOpacity>

            {/* Admin Button */}
            <TouchableOpacity
              style={styles.adminButton}
              onPress={handleAdminLogin}
            >
              <Text style={styles.adminButtonText}>Admin Login</Text>
            </TouchableOpacity>

            {/* Register Link */}
            <TouchableOpacity
              style={styles.registerLink}
              onPress={handleRegister}
            >
              <Text style={styles.registerLinkText}>
                Nemáte účet?{" "}
                <Text style={styles.registerLinkBold}>Registrujte sa</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo Accounts */}
          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>Demo účty:</Text>
            <Text style={styles.demoText}>Tréner: trener@ta.sk / trener123</Text>
            <Text style={styles.demoText}>Hráč: hrac@ta.sk / hrac123</Text>
            <Text style={styles.demoText}>Manažér: manazer@ta.sk / manazer123</Text>
            <Text style={styles.demoText}>Admin: admin@ta.sk / admin123</Text>
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
    paddingHorizontal: 20,
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
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 50,
    color: "#fff",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 8,
  },
  heading: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  form: {
    width: "100%",
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
  errorText: {
    color: "#f44336",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 12,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  adminButton: {
    backgroundColor: "#9C27B0",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  adminButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  registerLink: {
    alignItems: "center",
    marginTop: 8,
  },
  registerLinkText: {
    color: "#2196F3",
    fontSize: 14,
  },
  registerLinkBold: {
    fontWeight: "600",
  },
  demoContainer: {
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    padding: 16,
    marginTop: 30,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  demoText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
});
