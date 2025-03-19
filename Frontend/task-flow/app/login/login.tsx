import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../authcontext";
import { useState } from "react";

export default function TelaLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");

  
  const handleLogin = () => {
    if (username.trim()) {
      login(username); 
      router.replace("/(tabs)/home");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bem vindo ao TaskFlow!</Text>
      <Text>Entre na sua conta</Text>
      <TextInput
        placeholder="Digite seu nome"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, width: 200, padding: 10, marginVertical: 10 }}
      />
      <Button title="Entrar" onPress={handleLogin} />
      <Text>ou</Text>
      <Text onPress={() => router.push("/login/cadastro")}>Crie uma conta</Text>
    </View>
  );
};

const styles =  StyleSheet.create ({
  input: { 
    width: "100%", padding: 10, 
    borderWidth: 1, 
    borderRadius: 5, 
    marginBottom: 10 
  },
  button: { 
    backgroundColor: "blue", 
    padding: 10, 
    borderRadius: 5, 
    width: "100%", 
    alignItems: "center" 
  }
});
