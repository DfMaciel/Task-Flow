import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { useAuth } from "../authcontext";
import { router } from "expo-router";

export default function TelaUsuario() {
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout(); 
        router.replace("/login/logar"); 
    };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Usuário</Text>
      <Button onPress={handleLogout}> Sair </Button>
    </View>
  );
}