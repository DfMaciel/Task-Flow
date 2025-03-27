import api from "@/services/api";
import { router } from "expo-router";
import React, { SetStateAction, useState } from "react";
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, IconButton, Surface, TextInput } from "react-native-paper";
import { useTheme } from "react-native-paper";
import DialogErrorComponent from "./dialogErrorComponent";
import adicionarNota from "@/services/notas/adicionarNota";

export default function AdicionarNotaComponent({id, setModalVisible}: {id: number, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>}) {
    const [conteudo, setConteudo] = useState("");
    const [error, setError] = useState("");
    const [errorDialogVisible, setErrorDialogVisible] = useState(false);
    const [conteudoError, setConteudoError] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const tema = useTheme();

    const maxLength = 1000;

    async function handleAdicionarNota() {
        let hasError = false;  
        setConteudoError(false);

        if (conteudo.trim() === "") {
            setConteudoError(true);
            hasError = true;
        }
        
        if (hasError) return;

        setSubmitting(true);

        try {
            const nota = {
                conteudo,
            };

            const resposta = await adicionarNota(nota, id);
            if ( resposta.status === 201 ) {
                alert("Nota adicionada com sucesso")
                setModalVisible(false)
            }
        } catch (error:any) {
            setError(error.message);
            setErrorDialogVisible(true);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Surface style={styles.surface}>
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
                    <View style={styles.headerContainer}>
                        <IconButton
                            icon="notebook-plus-outline"
                            size={28}
                            iconColor={tema.colors.primary}
                        />
                        <Text style={[styles.title, {color: tema.colors.primary}]}>Nova Nota</Text>
                    </View>
                    
                    <TextInput
                        label="O que você quer registrar?"
                        placeholder="Digite o conteúdo da sua nota aqui..."
                        value={conteudo}
                        onChangeText={text => {
                            if (text.length <= maxLength) {
                                setConteudo(text);
                            }
                        }}
                        multiline
                        numberOfLines={10}
                        error={conteudoError}
                        style={styles.input}
                        mode="outlined"
                        outlineColor="#e0e0e0"
                        activeOutlineColor={tema.colors.primary}
                    />
                    
                    <View style={styles.inputFooter}>
                        {conteudoError && 
                            <Text style={{ color: tema.colors.error }}>
                                Por favor, digite algum conteúdo.
                            </Text>
                        }
                        <Text style={styles.characterCount}>
                            {conteudo.length}/{maxLength}
                        </Text>
                    </View>
                    
                    <Button
                        mode="contained"
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        onPress={handleAdicionarNota}
                        loading={submitting}
                        disabled={submitting}
                        buttonColor={tema.colors.primary}
                        icon="check-circle"
                    >
                        {submitting ? "Salvando..." : "Salvar Nota"}
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
    </Surface>
    );
}

const styles = StyleSheet.create({
    surface: {
        flex: 1,
        padding: 24,
        width: "100%",
        borderRadius: 16,
        elevation: 4,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
    },
    input: {
        width: "100%",
        minHeight: 150,
        marginBottom: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
    },
    inputFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    characterCount: {
        color: '#888',
        fontSize: 12,
        textAlign: 'right',
    },
    button: {
        width: "100%",
        paddingVertical: 6,
        borderRadius: 8,
        marginTop: 16,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '600',
        paddingVertical: 2,
    },
});