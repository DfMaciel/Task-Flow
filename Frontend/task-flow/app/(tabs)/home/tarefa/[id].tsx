import AdicionarNotaComponent from "@/components/adicionarNotaComponent";
import EditarIcon from "@/components/editaricon";
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
import { useLocalSearchParams, useRouter, useSearchParams } from "expo-router/build/hooks";
import React, { useState, useEffect, useCallback } from "react";
import { View, Button, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, FlatList, RefreshControl, Platform } from "react-native";
import { Icon, IconButton, TextInput } from "react-native-paper";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import atualizarTarefa from "@/services/tarefas/atualizarTarefa";
import excluirTarefa from "@/services/tarefas/deletarTarefa";


export default function VisualizarTarefaPage() {
    const searchParams= useSearchParams();
    const id = searchParams.get("id");
    const [tarefa, setTarefa] = useState<VisualizarTarefa>();
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState(false);
    const [notas, setNotas] = useState<VisualizarNota[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");    
    const [prazo, setPrazo] = useState<Date | null>(null);
    const [tempoEstimado, setTempoEstimado] = useState("");
    const [dataInicio , setDataInicio] = useState<Date | null>(null);
    const [dataConclusao , setDataConclusao] = useState<Date | null>(null);
    
    const [showPrazoPicker, setShowPrazoPicker] = useState(false);
    const [showInicioPicker, setShowInicioPicker] = useState(false);
    const [showConclusaoPicker, setShowConclusaoPicker] = useState(false);

    const router = useRouter()

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

    const handleToggleEdit = () => {
        setIsEditing(!isEditing);
    }
    
    useEffect(() => {
        if (tarefa) {
            setTitulo(tarefa.titulo || "");
            setDescricao(tarefa.descricao || "");
            setTempoEstimado(tarefa.tempoEstimado || "");
            setPrazo(tarefa.prazo ? new Date(tarefa.prazo) : null);
            setDataInicio(tarefa.dataInicio ? new Date(tarefa.dataInicio) : null);
            setDataConclusao(tarefa.dataConclusao ? new Date(tarefa.dataConclusao) : null);
        }
    }, [tarefa]);

    const onPrazoChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || prazo;
        setShowPrazoPicker(Platform.OS === 'ios');
        setPrazo(currentDate);
        
      };
      
      const onDataInicioChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || dataInicio;
        setShowInicioPicker(Platform.OS === 'ios');
        setDataInicio(currentDate);
      };
      
      const onDataConclusaoChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || dataConclusao;
        setShowConclusaoPicker(Platform.OS === 'ios');
        setDataConclusao(currentDate);
      };

    useEffect(() => {
        if (!isEditing) {
            setTitulo(tarefa?.titulo || "");
            setDescricao(tarefa?.descricao || "");
            setTempoEstimado(tarefa?.tempoEstimado || "");
            setPrazo(tarefa?.prazo ? new Date(tarefa.prazo) : null);
            setDataInicio(tarefa?.dataInicio ? new Date(tarefa.dataInicio) : null);
            setDataConclusao(tarefa?.dataConclusao ? new Date(tarefa.dataConclusao) : null);
        }
    }
    , [isEditing]);

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

    async function handleAtualizarTarefa () {
        try {
            const changedFields: Record<string, any> = {};
    
            if (titulo !== tarefa?.titulo) {
                changedFields['titulo'] = titulo;
            }
            
            if (descricao !== tarefa?.descricao) {
                changedFields['descricao'] = descricao;
            }
            
            if (tempoEstimado !== tarefa?.tempoEstimado) {
                changedFields['tempoEstimado'] = tempoEstimado;
            }
            
            const formattedPrazo = prazo ? prazo.toISOString().split('T')[0] : "";
            if (formattedPrazo !== tarefa?.prazo) {
                changedFields['prazo'] = formattedPrazo;
            }
            
            if (dataInicio) {
                const formattedDataInicio = dataInicio.toISOString();
                if (formattedDataInicio !== tarefa?.dataInicio) {
                    changedFields['dataInicio'] = formattedDataInicio;
                }
            } else if (tarefa?.dataInicio) {
                changedFields['dataInicio'] = null;
            }

            if (dataConclusao) {
                const formattedDataConclusao = dataConclusao.toISOString();
                if (formattedDataConclusao !== tarefa?.dataConclusao) {
                    changedFields['dataConclusao'] = formattedDataConclusao;
                }
            } else if (tarefa?.dataConclusao) {
                changedFields['dataConclusao'] = null;
            }
            
            console.log('Changed fields:', changedFields);
            const resposta = await atualizarTarefa(Number(id), changedFields);
            if (resposta.status === 200) {
                alert("Tarefa atualizada com sucesso!");
                setIsEditing(false);
                await carregarTarefa();
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleExcluirTarefa() {
        const resposta = await excluirTarefa(Number(id))
        if (resposta.status === 200) {
            alert("Tarefa excluida com sucesso!")
            router.push('/home');
        }
    }
    
    return (
        <View style={{ flex: 1}}>
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
                        onChangeText={text => {
                            if (text.length <= 120) {
                                setTitulo(text);
                            }
                        }}
                        style={[style.input]}
                    />
                ) : (
                    <Text style={style.title}>{tarefa?.titulo}</Text>
                )}
                {isEditing ? ( 
                    <View style={style.editableFieldsContainer}>
                        {/* Prazo Field */}
                        <View style={style.editableField}>
                        <Text style={style.fieldLabel}>Prazo:</Text>
                            <TouchableOpacity 
                            style={style.datePickerButton} 
                            onPress={() => setShowPrazoPicker(true)}
                            >
                            <Text style={style.datePickerText}>
                                {prazo ? formatDateTime(prazo.toISOString()) : "Selecionar prazo"}
                            </Text>
                            <Icon source="calendar" size={20} color="#6750A4" />
                            </TouchableOpacity>
                        </View>
                        <View style={style.editableField}>
                        <Text style={style.fieldLabel}>Tempo estimado:</Text>
                            <TextInput
                            value={tempoEstimado}
                            onChangeText={setTempoEstimado}
                            keyboardType="numeric"
                            style={style.timeInput}
                            placeholder="Horas"
                            right={<TextInput.Affix text="horas" />}
                            />
                        </View>
                        <View style={style.editableField}>
                            <Text style={style.fieldLabel}>Iniciada em:</Text>
                            <TouchableOpacity 
                                style={style.datePickerButton} 
                                onPress={() => setShowInicioPicker(true)}
                            >
                                <Text style={style.datePickerText}>
                                {dataInicio ? formatDateTime(dataInicio.toISOString()) : "Não iniciada"}
                                </Text>
                                <Icon source="calendar" size={20} color="#6750A4" />
                            </TouchableOpacity>
                        </View>
                        <View style={style.editableField}>
                        <Text style={style.fieldLabel}>Concluída em:</Text>
                        <TouchableOpacity 
                            style={style.datePickerButton} 
                            onPress={() => setShowConclusaoPicker(true)}
                        >
                            <Text style={style.datePickerText}>
                            {dataConclusao ? formatDateTime(dataConclusao.toISOString()) : "Não concluída"}
                            </Text>
                            <Icon source="calendar" size={20} color="#6750A4" />
                        </TouchableOpacity>
                        </View>
                    </View>
                ): 
                (
                    <>
                        <View style={style.dataContainer}>
                            <Text style={style.prazo}>Prazo: {formatPrazo(tarefa?.prazo)} - </Text>
                            <Icon source="timer-outline" size={20} color="grey"/>
                            <Text style={{fontWeight: "bold", color: "grey", fontSize: 16}}>{tarefa?.tempoEstimado} horas</Text>
                        </View>
                        <Text style={[style.prazo, {marginBottom: 5}]}>Criada em: {formatDateTime(tarefa?.dataCriacao)}</Text>
                        <Text style={[style.prazo, {marginBottom: 5}]}>Iniciada em: {tarefa?.dataInicio? formatDateTime(tarefa?.dataInicio) : "Não foi iniciada"}</Text>
                        <Text style={[style.prazo, {marginBottom: 5}]}>Concluída em: {tarefa?.dataConclusao? formatDateTime(tarefa?.dataConclusao) : "Não foi concluída"}</Text>
                    </>
                )}
                <View style={style.infoContainer}>{tarefa?.prioridade && <PrioridadeComponent prioridade={tarefa?.prioridade} isEditable={true} onPrioridadeChange={trocarPrioridade} /> }
                    {tarefa?.status && <StatusComponent status={tarefa?.status} isEditable={true} onStatusChange={trocarStatus} /> }
                </View>
                <Text style={style.descricaoTitle}>Descrição da tarefa</Text>
                {isEditing ? (
                    <TextInput
                        label="Descrição"
                        value={descricao}
                        onChangeText={text => {
                            if (text.length <= 2000) {
                                setDescricao(text);
                            }
                        }}
                        multiline
                        numberOfLines={10}
                        style={[style.input]}
                    />
                ): (
                    <Text style={style.descricao}>
                        {expanded ? tarefa?.descricao : tarefa?.descricao.substring(0, 150)}
                        {tarefa?.descricao && tarefa?.descricao.length > 150 && (
                            <Text onPress={toggleExpanded} style={style.lerMais}>
                                {expanded ? " Ler menos" : "... Ler mais"}
                            </Text>
                        )}
                    </Text>
                )}
                
                <Text style={[style.descricaoTitle, { marginTop: 10}]}>Anexos</Text>
                {/* <View>
                     <TouchableOpacity 
                        style={style.addAnexoButton}
                        onPress={() => {}}
                        >
                        <View style={style.addAnexoContent}>
                            <Icon source="plus-circle-outline" size={20} color="#6750A4" />
                            <Text style={style.adicionarTitle}>Adicionar novo anexo</Text>
                        </View>
                    </TouchableOpacity>
                </View> */}
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
                {showPrazoPicker && (
                    <DateTimePicker
                        value={prazo || new Date()}
                        mode="date"
                        display="default"
                        onChange={onPrazoChange}
                    />
                )}

               {showInicioPicker && (
                    <DateTimePicker
                        value={dataInicio || new Date()}
                        mode="date"
                        display="default"
                        onChange={onDataInicioChange}
                    />
                )}

                {showConclusaoPicker && (
                    <DateTimePicker
                        value={dataConclusao || new Date()}
                        mode="date"
                        display="default"
                        onChange={onDataConclusaoChange}
                    />
                )} 
            </ScrollView>
            <EditarIcon 
                    isEditing={isEditing} 
                    onToggleEdit={handleToggleEdit} 
                    onSave={handleAtualizarTarefa}
                    onDelete={handleExcluirTarefa}
                />
        </View>
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
    editableFieldsContainer: {
        marginVertical: 16,
    },
    editableField: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'grey',
        width: 120,
    },
    fieldValue: {
        fontSize: 16,
        flex: 1,
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        flex: 1,
        backgroundColor: 'white',
    },
    datePickerText: {
        fontSize: 16,
        color: '#333',
    },
    timeInput: {
        flex: 1,
        backgroundColor: 'white',
        height: 50,
    },
    descricaoInput: {
        textAlignVertical: 'top',
        minHeight: 120,
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