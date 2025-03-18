import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bem-vindo ao MeuApp!</Text>
      <Button title="Ir para Configurações" onPress={() => router.push("/settings")} />
    </View>
  );
}
