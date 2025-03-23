import { View, Text, StyleSheet,KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../authcontext";
import { useState } from "react";
import FilledButton from "../components/filledButtonComponent";
import GradientBackground from "../components/linearGradientContainer";
import OutlinedButton from "../components/outlinedButtonComponent";
import TitleTextComponent from "../components/titleTextComponent";
import { TextInput } from "react-native-paper";

export default function TelaLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  
  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(text);
    
    if (text.length > 0 && !emailRegex.test(text)) {
        setEmailError("Por favor, insira um email válido");
    } else {
        setEmailError("");
    }
};

const handleLogin = async () => {
    if (emailError || !email || !password) {
      setError("Por favor, preencha todos os campos corretamente");
      return;
    }
    
    try {
      const result = await login(email, password);
      if (result.success) {
        router.replace("/(tabs)/home");
      } else {
        setError(result.message || "Erro ao fazer login");
      }
    } catch (error) {
      setError("Ocorreu um erro ao tentar fazer login");
    }
  };


  return (
    <GradientBackground style={styles.mainDiv} lavaLamp={true}>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, width: "100%" }}
            keyboardVerticalOffset={100} 
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.formDiv}>
                    <TitleTextComponent text="Bem vindo de volta!" color="white" />
                    <TextInput 
                        label="Email" 
                        style={emailError && styles.inputError}
                        value={email}
                        onChangeText={validateEmail}
                        outlineColor={emailError ? "#FF6B6B" : ""}
                        keyboardType="email-address"
                        error={!!emailError}
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    
                    <TextInput 
                        label="Senha" 
                        onChangeText={password => setPassword(password)}    
                        secureTextEntry={!showPassword}
                        right={
                            <TextInput.Icon 
                                icon={showPassword ? "eye-off" : "eye"} 
                                onPress={() => setShowPassword(!showPassword)}
                                color="#6247aa"
                            />
                        }
                    />
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <Text style={{fontSize: 17, color: "white"}}> Esqueceu sua senha? </Text>
                    <FilledButton text="Entrar" color="#6247aa" onPress={() => router.replace("/(tabs)/home")} />
                    <Text style={{textAlign: "center", fontSize: 20, color: "white"}}> ou </Text>
                    <OutlinedButton text="Fazer cadastro" textColor="white" onPress={() => router.push("/login/cadastro")} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </GradientBackground>
)
}

const styles = StyleSheet.create({
mainDiv: {
    flex: 1,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    alignItems: "center",
},
scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
},
formDiv: {
    padding: 10,
    width: "100%",
    zIndex: 2,
    elevation: 10,
    gap: 15,
    marginTop: 80
},
errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 5,
},
inputError: {
    borderColor: "#FF6B6B",
},
});
