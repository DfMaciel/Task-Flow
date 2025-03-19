import { View, Text, Button, StyleSheet, Platform, KeyboardAvoidingView, ScrollView} from "react-native";
import { useRouter } from "expo-router";
import GradientBackground from "../components/linearGradientContainer";
import TitleTextComponent from "../components/titleTextComponent";
import { TextInput } from "react-native-paper";
import { useState } from "react";
import FilledButton from "../components/filledButtonComponent";
import OutlinedButton from "../components/outlinedButtonComponent";

export default function TelaCadastro() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    
    const validateEmail = (text: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmail(text);
        
        if (text.length > 0 && !emailRegex.test(text)) {
            setEmailError("Por favor, insira um email válido");
        } else {
            setEmailError("");
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
                        <TitleTextComponent text="Crie sua conta!" color="white" />
                        <TextInput 
                            label="Nome"
                            onChangeText={name => setName(name)} 
                        />
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
                        <Text style={{fontSize: 17, color: "white"}}> Esqueceu sua senha? </Text>
                        <FilledButton text="Cadastrar" color="#6247aa" onPress={() => router.replace("/(tabs)/home")} />
                        <Text style={{textAlign: "center", fontSize: 20, color: "white"}}> ou </Text>
                        <OutlinedButton text="Fazer login" textColor="white" onPress={() => router.push("/login/login")} />
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