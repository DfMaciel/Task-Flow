import { router } from "expo-router";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import TitleTextComponent from "../../components/titleTextComponent";
import GradientBackground from "../../components/linearGradientContainer";
import FilledButton from "../../components/filledButtonComponent";
import OutlinedButton from "../../components/outlinedButtonComponent";

export default function IndexPage() {
    return (
        <GradientBackground style={styles.mainDiv} lavaLamp={true}>
            <View style={styles.contentDiv}>
                <TitleTextComponent text="TaskFlow" color="white" />
                <Text style={{fontSize: 17, color:"white"}}>Seu companheiro no gerenciamento de tarefas</Text>
                <View style={styles.buttonDiv}>
                    <FilledButton text="Entrar" color="white" textColor="#6247aa" onPress={() => router.push("/login/login")} />
                    <OutlinedButton text="Cadastrar" textColor="white" onPress={() => router.push("/login/cadastro")} />
                </View>
            </View>
        </GradientBackground>
    )
}

export const styles = StyleSheet.create({
    mainDiv: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
    },
    contentDiv: {
        padding: 10,
        width: "100%",
        height: "93%",
        justifyContent: "flex-end",
        zIndex: 100,
        elevation: 100,
    },
    buttonDiv: {
        marginTop: 40,
        justifyContent: "space-between"
    },
    
});