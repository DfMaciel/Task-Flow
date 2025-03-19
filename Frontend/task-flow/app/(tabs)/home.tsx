// app/home.tsx

import { View, Text, Button } from "react-native";
import { useAuth } from "../authcontext";
import { router } from "expo-router";

const HomeScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout(); 
    router.replace("/login/login"); 
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bem-vindo, {user}!</Text>
      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
};

export default HomeScreen;
