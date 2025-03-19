import { View, Text, Button, StyleSheet} from "react-native";
import { useRouter } from "expo-router";
import GradientBackground from "../components/linearGradientContainer";
import TitleTextComponent from "../components/titleTextComponent";
import { TextInput } from "react-native-paper";
import { useState } from "react";

export default function TelaCadastro() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    
    return (
        <GradientBackground style={styles.mainDiv} lavaLamp={true}>
            <View>
                <TitleTextComponent text="Crie sua conta!" color="white" />
                <View style={styles.formDiv}>
                    <TextInput 
                        placeholder="Nome"
                        onChangeText={email => setEmail(email)} />
                    <TextInput placeholder="Email" />
                    <TextInput placeholder="Senha" />
                    <Button title="Cadastrar" onPress={() => router.push("/login/login")} />
                </View>
            </View>
        </GradientBackground>
    )
}

const styles = StyleSheet.create({
    mainDiv: {
        flex: 1,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    formDiv: {
        padding: 10,
        marginTop: 500,
        width: "100%",
        zIndex: 2,
    }
});