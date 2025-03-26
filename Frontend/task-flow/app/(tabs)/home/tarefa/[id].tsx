import AdicionarNotaComponent from "@/components/adicionarNotaComponent";
import PrioridadeComponent from "@/components/prioridadeComponent";
import StatusComponent from "@/components/statusComponent";
import atualizarStatusTarefa from "@/services/tarefas/atualizarStatusTarefa";
import buscarTarefa from "@/services/tarefas/buscarTarefa";
import { VisualizarNota } from "@/types/NotasInterface";
import { VisualizarTarefa } from "@/types/TarefaInteface";
import formatDateTime from "@/utils/dateFormater";
import formatPrazo from "@/utils/dateTimeParser";
import { useSearchParams } from "expo-router/build/hooks";
import React, { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Icon } from "react-native-paper";

export default function VisualizarTarefaPage() {
    const searchParams= useSearchParams();
    const id = searchParams.get("id");
    const [tarefa, setTarefa] = useState<VisualizarTarefa>();
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState(false);
    const [notas, setNotas] = useState<VisualizarNota[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        async function carregarTarefa() {
            try {
                const resposta = await buscarTarefa(Number(id));
                setTarefa(resposta.data);
                if (resposta.data.notas) {
                    setNotas(resposta.data.notas);
                }
            } catch (error) {
                console.error(error);
            }
        }
        carregarTarefa();
    }, []);
    
    const toggleExpanded = () => {
        setExpanded(!expanded);
      };
    
    async function trocarStatus(newStatus: string) {
        try {
            const resultado = await atualizarStatusTarefa(Number(id), newStatus);
            if (resultado.status === 200) {
                console.log("Status alterado com sucesso");
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <ScrollView style={style.scrollContainer} contentContainerStyle={style.scrollContent}>
            <Text style={style.title}>{tarefa?.titulo}</Text>
            <View style={style.dataContainer}>
                <Text style={style.prazo}>Prazo: {formatPrazo(tarefa?.prazo)} - </Text>
                <Icon source="timer-outline" size={20} color="grey"/>
                <Text style={{fontWeight: "bold", color: "grey", fontSize: 16}}>{tarefa?.tempoEstimado} horas</Text>
            </View>
            <Text style={[style.prazo, {marginBottom: 5}]}>Criada em: {formatDateTime(tarefa?.dataCriacao)}</Text>
            <View style={style.infoContainer}>{tarefa?.prioridade && <PrioridadeComponent prioridade={tarefa?.prioridade} /> }
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
                <Button title="Adicionar anexo" onPress={() => {}} />
            </View>
            <View style={style.notasHeader}>
                <Text style={[style.descricaoTitle, { marginTop: 10}]}>Notas adicionais</Text>
                <Text style={style.adicionarTitle} onPress={() => setModalVisible(true)}>Adicionar notas</Text>
            </View>
            <View>
                {notas.length > 0 ? notas.map((nota) => (
                    <View key={nota.id}>
                        <Text>{nota.conteudo}</Text>
                        <Text>{nota.dataCriacao}</Text>
                    </View>
                )) : <Text style={{fontSize: 15}}>Nenhuma nota adicionada</Text>}
            </View>
            <View style={style.notasHeader}>
                <Text style={style.descricaoTitle}>Check-In</Text>
            </View>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
                >
                <View style={style.modalContainer}>
                    <View style={style.modalContent}>
                    <AdicionarNotaComponent id={Number(id)} />
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
    notasHeader: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    adicionarTitle: {
        fontSize: 15,
        marginTop: 6,
        fontWeight: "bold",
        color: "purple"
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContent: {
        width: "90%",
        height: "50%",
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