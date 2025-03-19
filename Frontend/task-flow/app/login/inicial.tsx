import { router } from "expo-router";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import TitleTextComponent from "../components/titleTextComponent";
import GradientBackground from "../components/linearGradientContainer";

export default function IndexPage() {
    return (
        <GradientBackground style={styles.mainDiv} lavaLamp={true}>
            <View style={styles.contentDiv}>
                <TitleTextComponent text="TaskFlow" color="white" />
                <Text style={{fontSize: 17, color:"white"}}>Seu companheiro no gerenciamento de tarefas</Text>
                <View style={styles.buttonDiv}>
                    <Button 
                        mode="contained" 
                        style={styles.buttonFilled}
                        labelStyle={styles.buttonText}
                        buttonColor="#FFFFFF"
                        textColor="#6247aa"
                        onPress={() => router.push("/login/login")}> 
                        Entrar
                    </Button>
                    <Button 
                        mode="outlined" 
                        style={styles.buttonOutlined} 
                        labelStyle={styles.buttonText}
                        textColor="white"
                        onPress={() => router.push("/login/cadastro")}
                    >
                        Cadastre-se
                    </Button>
                </View>
            </View>
        </GradientBackground>
    )
}

const styles = StyleSheet.create({
    mainDiv: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    contentDiv: {
        padding: 10,
        marginBottom: 40,
        width: "100%",
        zIndex: 2,
    },
    buttonDiv: {
        marginTop: 40,
        justifyContent: "space-between"
    },
    buttonFilled: {
        width: "100%",
    },
    buttonOutlined: {
        width: "100%",
        marginTop: 15,
        borderColor: "white"
    },
    buttonText: {
        fontSize: 15,  
        fontWeight: "bold"  
    }
});