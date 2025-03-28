import AdicionarNotaComponent from "@/components/adicionarNotaComponent";
import PrioridadeComponent from "@/components/prioridadeComponent";
import StatusComponent from "@/components/statusComponent";
import excluirNota from "@/services/notas/excluirNota";
import atualizarPrioridadeTarefa from "@/services/tarefas/atualizarPrioridadeTarefa";
import atualizarStatusTarefa from "@/services/tarefas/atualizarStatusTarefa";
import buscarTarefa from "@/services/tarefas/buscarTarefa";
import { VisualizarNota } from "@/types/NotasInterface";
import { VisualizarTarefa } from "@/types/TarefaInteface";
import formatDateTime from "@/utils/dateFormater";
import formatPrazo from "@/utils/dateTimeParser";
import { useNavigation } from "expo-router";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import React, { useState, useEffect, useCallback } from "react";
import { View, Button, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, FlatList, RefreshControl } from "react-native";
import { Icon, TextInput } from "react-native-paper";

export default function VisualizarTarefaPage() {
    const searchParams= useSearchParams();
    const id = searchParams.get("id");
    const [tarefa, setTarefa] = useState<VisualizarTarefa>();
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState(false);
    const [notas, setNotas] = useState<VisualizarNota[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const params = useLocalSearchParams();
    const isEditing = params.isEditing === 'true'
    const navigation = useNavigation();

    const [titulo, setTitulo] = useState(tarefa?.titulo);
    const [descricao, setDescricao] = useState(tarefa?.descricao);
    

    const carregarTarefa = async () => {
        try {
            const resposta = await buscarTarefa(Number(id));
            setTarefa(resposta.data);
            if (resposta.data.notas) {
                setNotas(resposta.data.notas);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        carregarTarefa();
    }, []);
    
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await carregarTarefa();
        setRefreshing(false);
    }, [id]);
    
    const toggleExpanded = () => {
        setExpanded(!expanded);
      };
    
    async function trocarStatus(newStatus: string) {
        try {
            const resultado = await atualizarStatusTarefa(Number(id), newStatus);
            if (resultado.status === 200) {
                console.log("Status alterado com sucesso");
                await carregarTarefa();
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    async function trocarPrioridade(newPrioridade: string) {
        try {
            const resultado = await atualizarPrioridadeTarefa(Number(id), newPrioridade);
            if (resultado.status === 200) {
                console.log("Prioridade alterada com sucesso");
                await carregarTarefa();
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleExcluirNota (id: number) {
        try {
            const resultado = await excluirNota({id});
            if (resultado.status === 200) {
                console.log("Nota excluída com sucesso");
                await carregarTarefa();
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <ScrollView 
            style={style.scrollContainer} 
            contentContainerStyle={style.scrollContent} 
            nestedScrollEnabled={true}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing} 
                    onRefresh={onRefresh} 
                    colors={["#6750A4"]} 
                    tintColor="#6750A4"
                />
            }
        >
            {isEditing ? (
                <TextInput
                    label="Titulo da tarefa"
                    value={titulo}
                    onChangeText={setTitulo}
                    style={[style.input]}
                />
            ) : (
                <Text style={style.title}>{tarefa?.titulo}</Text>
            )}
            <View style={style.dataContainer}>
                <Text style={style.prazo}>Prazo: {formatPrazo(tarefa?.prazo)} - </Text>
                <Icon source="timer-outline" size={20} color="grey"/>
                <Text style={{fontWeight: "bold", color: "grey", fontSize: 16}}>{tarefa?.tempoEstimado} horas</Text>
            </View>
            <Text style={[style.prazo, {marginBottom: 5}]}>Criada em: {formatDateTime(tarefa?.dataCriacao)}</Text>
            <Text style={[style.prazo, {marginBottom: 5}]}>Iniciada em: {tarefa?.dataInicio? formatDateTime(tarefa?.dataInicio) : "Não foi iniciada"}</Text>
            <Text style={[style.prazo, {marginBottom: 5}]}>Concluída em: {tarefa?.dataConclusao? formatDateTime(tarefa?.dataConclusao) : "Não foi concluída"}</Text>
            <View style={style.infoContainer}>{tarefa?.prioridade && <PrioridadeComponent prioridade={tarefa?.prioridade} isEditable={true} onPrioridadeChange={trocarPrioridade} /> }
                {tarefa?.status && <StatusComponent status={tarefa?.status} isEditable={true} onStatusChange={trocarStatus} /> }
            </View>
            <Text style={style.descricaoTitle}>Descrição da tarefa</Text>
            <Text style={style.descricao}>
                {expanded ? tarefa?.descricao : tarefa?.descricao.substring(0, 150)}
                {tarefa?.descricao && tarefa?.descricao.length > 150 && (
                    <Text onPress={toggleExpanded} style={style.lerMais}>
                        {expanded ? " Ler menos" : "... Ler mais"}
                    </Text>
                )}
            </Text>
            <Text style={[style.descricaoTitle, { marginTop: 10}]}>Anexos</Text>
            <View>
                <TouchableOpacity 
                    style={style.addAnexoButton}
                    onPress={() => {}}
                    >
                    <View style={style.addAnexoContent}>
                        <Icon source="plus-circle-outline" size={20} color="#6750A4" />
                        <Text style={style.adicionarTitle}>Adicionar novo anexo</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={style.adicionarNotaTitle}>
                <Text style={style.descricaoTitle}>Notas</Text>
                <Text onPress={() => setModalVisible(true)} style={style.lerMais}>
                    Adicionar nova nota
                </Text>
            </View>
            <View style={style.notasContainer}>
            {notas.length > 0 ? (
                notas.map((nota) => (
                    <View key={nota.id} style={style.notaItem}>
                        <View style={style.notaHeader}>
                            <Text style={style.notaData}>
                                <Icon source="calendar-clock" size={14} color="#6750A4" />
                                {" "}{formatDateTime(nota.dataCriacao)}
                            </Text>
                            <TouchableOpacity 
                                onPress={() => handleExcluirNota(nota.id)}
                                style={style.deleteButton}
                            >
                                <Icon source="delete-outline" size={20} color="#D32F2F" />
                            </TouchableOpacity>
                        </View>
                        <Text style={style.notaConteudo}>{nota.conteudo}</Text>
                    </View>
                ))
            ): (
                    <View style={style.emptyNotesContainer}>
                        <Icon source="note-outline" size={24} color="#9e9e9e" />
                        <Text style={style.emptyNotesText}>Nenhuma nota adicionada</Text>
                    </View>
                )}
            </View>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
                >
                <View style={style.modalContainer}>
                    <View style={style.modalContent}>
                    <AdicionarNotaComponent id={Number(id)} setModalVisible={setModalVisible} onSuccess={carregarTarefa}/>
                    <TouchableOpacity
                        style={style.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={style.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                </Modal>
        </ScrollView>
    );
}

const style = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40, 
    },
    container: {
        flex: 1,
        padding: 16
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 5
    },
    input: {
        marginVertical: 8,
        backgroundColor: 'white',
    },
    infoContainer: {
        flexDirection: "row",
        marginBottom: 10
    },
    dataContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    prazo: {
        fontSize: 18,
        fontWeight: "bold",
        marginRight: 1,
        color: "grey"
    },
    descricaoTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 5,
        color: "grey"
    },
    descricao: {
        fontSize: 17
    },
    lerMais: {
        color: "purple",
        fontWeight: "bold",
    },
    notasContainer: {
        marginTop: 8,
        marginBottom: 16,
    },
    adicionarNotaTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingBottom: 8,
    },
    addAnexoButton: {
        backgroundColor: '#f0e7fd', 
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#6750A4',
    },
    addAnexoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    adicionarTitle: {
        fontSize: 15,
        marginLeft: 8,
        fontWeight: "bold",
        color: "purple"
    },
    notaItem: {
        backgroundColor: '#f8f4ff',
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#6750A4',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    notaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    notaData: {
        fontSize: 12,
        color: '#757575',
    },
    notaConteudo: {
        fontSize: 16,
        lineHeight: 22,
    },
    deleteButton: {
        padding: 4,
    },
    emptyNotesContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        marginVertical: 8,
    },
    emptyNotesText: {
        fontSize: 15,
        color: '#9e9e9e',
        marginTop: 8
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
    modalContent: {
        width: "90%",
        height: "60%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
      },
    closeButton: {
        marginTop: 20,
        backgroundColor: "purple",
        padding: 10,
        borderRadius: 5,
      },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});