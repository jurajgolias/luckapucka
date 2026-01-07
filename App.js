import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProvider } from "./context/UserContext";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AdminDashboard from "./screens/AdminDashboard";
import ManagerDashboard from "./screens/ManagerDashboard";
import ProfileScreen from "./screens/ProfileScreen";
import MessagesScreen from "./screens/MessagesScreen";
import TrainingListScreen from "./screens/TrainingListScreen";
import CreateTrainingScreen from "./screens/CreateTrainingScreen";
import TrainingDetailScreen from "./screens/TrainingDetailScreen";
import ChatDetailScreen from "./screens/ChatDetailScreen";
import TrainerTeamsScreen from "./screens/TrainerTeamsScreen";
import TeamDetailScreen from "./screens/TeamDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            animation: "default",
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="ManagerDashboard" component={ManagerDashboard} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Messages" component={MessagesScreen} />
          <Stack.Screen name="TrainingList" component={TrainingListScreen} />
          <Stack.Screen name="CreateTraining" component={CreateTrainingScreen} />
          <Stack.Screen name="TrainingDetail" component={TrainingDetailScreen} />
          <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
          <Stack.Screen name="TrainerTeams" component={TrainerTeamsScreen} />
          <Stack.Screen name="TeamDetail" component={TeamDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
