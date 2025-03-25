import api from "@/services/api";
import { router } from "expo-router";
import { useState } from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useTheme } from "react-native-paper";
import DialogErrorComponent from "./dialogErrorComponent";
import adicionarNota from "@/services/notas/adicionarNota";

export default function AdicionarNotaComponent({id}: {id: number}) {
    const [conteudo, setConteudo] = useState("");
    const [error, setError] = useState("");
    const [errorDialogVisible, setErrorDialogVisible] = useState(false);
    const [conteudoError, setConteudoError] = useState(false);
    const tema = useTheme();

    async function handleAdicionarNota() {
        let hasError = false;  
        setConteudoError(false);

        if (conteudo.trim() === "") {
            setConteudoError(true);
            hasError = true;
        }
        
        if (hasError) return;

        try {
            const nota = {
                conteudo,
            };

            const resposta = await adicionarNota(nota, id);
            if ( resposta.status === 201 ) {
                alert("Nota adicionada com sucesso")
                router.push(`/home/tarefa/${id}`);
            }
        } catch (error:any) {
            setError(error.message);
            setErrorDialogVisible(true);
        }
    }

    return (
        <View style={styles.container}>
            <DialogErrorComponent 
                visible={errorDialogVisible} 
                error={error} 
                onDismiss={() => setErrorDialogVisible(false)}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, width: "100%" }}
                keyboardVerticalOffset={100} 
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                >
                    <Text style={styles.title}>Adicionar Nota</Text>
                    <TextInput
                        label="Conteúdo"
                        value={conteudo}
                        onChangeText={setConteudo}
                        multiline
                        error={conteudoError}
                        style={styles.input}
                    />
                    {conteudoError && <Text style={{ color: tema.colors.error, marginBottom: 10 }}>Insira um conteúdo valido.</Text>}
                    <Button
                        mode="contained"
                        style={styles.button}
                        onPress={handleAdicionarNota}
                    >
                        Adicionar
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: "center",
        alignItems: "center",
        padding: 20,
        width: "100%",
    },
    scrollContainer: {
        flexGrow: 1,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 150,
        marginBottom: 10,
        backgroundColor: 'rgba(219, 216, 219, 0.25)',
    },
    button: {
        width: "100%",
    },
});