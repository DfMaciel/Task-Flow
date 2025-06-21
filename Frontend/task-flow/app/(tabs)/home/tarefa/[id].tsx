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
import { useRouter, useSearchParams } from "expo-router/build/hooks";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, SectionList, StyleSheet, Modal, TouchableOpacity, ScrollView, FlatList, RefreshControl, Platform, Alert, Share } from "react-native";
import { Icon, IconButton, TextInput, Button } from "react-native-paper";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import atualizarTarefa from "@/services/tarefas/atualizarTarefa";
import excluirTarefa from "@/services/tarefas/deletarTarefa";
import { VisualizarCategoria } from "@/types/CategoriasInterface";
import CategoriaComponent from "@/components/categoriaComponent";
import atualizarCategoriaTarefa from "@/services/tarefas/atualizarCategoriaTarefa";
import desvincularCategoriaTarefa from "@/services/tarefas/desvincularCategoriaTarefa";
import AnexoComponent from "@/components/anexoComponent";
import excluirAnexo from "@/services/anexos/excluirAnexo";
import AdicionarAnexoComponent from "@/components/adicionarAnexoComponent";
import SubTarefasComponent from "@/components/subTarefasComponent";
import desvincularSubTarefa from "@/services/tarefas/desvincularSubTarefa";
import vincularSubTarefa from "@/services/tarefas/vincularSubTarefa";
import AdicionarSubTarefaComponent from "@/components/adicionarSubTarefaComponent";
import * as Linking from 'expo-linking';


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
    const [categoria, setCategoria] = useState<VisualizarCategoria | null>(null)
    const [categorias, setCategorias] = useState<VisualizarCategoria[]>([]);
    
    const [showPrazoPicker, setShowPrazoPicker] = useState(false);
    const [showInicioPicker, setShowInicioPicker] = useState(false);
    const [showConclusaoPicker, setShowConclusaoPicker] = useState(false);
    const [showCategoriaPicker, setShowCategoriaPicker] = useState(false);

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
            setCategoria(tarefa.categoria || null);
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
      
    const timeSpentInfo = useMemo(() => {
        if (!tarefa || !tarefa.dataInicio) {
            return { hoursSpent: null, isOverEstimate: false, displayText: null };
        }

        const dataInicio = new Date(tarefa.dataInicio);
        const dataFim = tarefa.dataConclusao ? new Date(tarefa.dataConclusao) : new Date();

        if (isNaN(dataInicio.getTime())) {
            return { hoursSpent: null, isOverEstimate: false, displayText: "Data de início inválida" };
        }

        const diffMs = dataFim.getTime() - dataInicio.getTime();

        if (diffMs <= 0) {
            return { hoursSpent: 0, isOverEstimate: false, displayText: "0.0 horas" };
        }

        const hoursSpent = diffMs / (1000 * 60 * 60);
        let isOverEstimate = false;
        
        const tempoEstimadoNum = parseFloat(tarefa.tempoEstimado || "");

        if (!isNaN(tempoEstimadoNum) && tempoEstimadoNum > 0) {
            isOverEstimate = hoursSpent > tempoEstimadoNum;
        }

        return {
            hoursSpent: hoursSpent,
            isOverEstimate: isOverEstimate,
            displayText: `${hoursSpent.toFixed(1)} horas`
        };
    }, [tarefa]);

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
    }, [id]);
    
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
    
    async function trocarCategoria(newCategoria: VisualizarCategoria | null) {
        try {
            if (newCategoria === null) {
                const resultado = await desvincularCategoriaTarefa(Number(id))
                if (resultado.status === 200) {
                    console.log("Categoria desvinculada com sucesso");
                    await carregarTarefa();
                }
            } 
            else {
                const resultado = await atualizarCategoriaTarefa(Number(id), Number(newCategoria.id));
                if (resultado.status === 200) {
                    console.log("Categoria alterada com sucesso");
                    await carregarTarefa();
                }
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
    
    const handleExcluirAnexo = async (id: number, nome: string) => {
        try {
            const resultado = await excluirAnexo(id);
            Alert.alert("Removido", `"${nome}" foi excluído.`);
        } catch (error) {
            console.error("Erro ao excluir:", error);
            Alert.alert("Erro", "Não foi possível excluir o anexo.");
        } finally {
            await carregarTarefa();
        }
      };

    const handleNavegarSubTarefa = (id: number) => {
        setTarefa(undefined)
        router.push(`/home/tarefa/${id}`);
    }

    const handleDesvincularSubTarefa = async (subTarefa: number) => {
            Alert.alert(
                "Desvincular Sub-Tarefa",
                "Você tem certeza que deseja desvincular esta sub-tarefa?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Desvincular",
                        style: "destructive",
                        onPress: async () => {
                            try {
                            const resposta = await desvincularSubTarefa(Number(id), subTarefa);
                            if (resposta.status === 200) {
                                console.log("Sub-tarefa desvinculada com sucesso");
                                await carregarTarefa();
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleDesvincularTarefaPai = async (tarefaPai: number) => {
            Alert.alert(
                "Desvincular Tarefa-Pai",
                "Você tem certeza que deseja desvincular esta tarefa-pai?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Desvincular",
                        style: "destructive",
                        onPress: async () => {
                            try {
                            const resposta = await desvincularSubTarefa(tarefaPai, Number(id));
                            if (resposta.status === 200) {
                                console.log("Tarefa-Pai desvinculada com sucesso");
                                await carregarTarefa();
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleVincularSubTarefa = async (subTarefa: number) => {
        try {
            console.log('passou direto')
            const resposta = await vincularSubTarefa(Number(id), subTarefa);
            if (resposta.status === 200) {
                console.log("Sub-tarefa vinculada com sucesso");
                await carregarTarefa();
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    const handleVincularTarefaPai = async (tarefaPai: number) => {
        let tarefaPaiId = tarefa?.tarefaPai?.id 
        if (tarefaPaiId) {
            console.log('parou no if')
            Alert.alert(
                "Tarefa-Pai já vinculada",
                "Essa tarefa já possui uma tarefa-pai vinculada. Deseja desvincular a tarefa-pai atual e vincular uma nova?",
                [
                    {
                        text: "Cancelar",
                        style: "cancel"
                    },
                    {
                        text: "Desvincular e Vincular",
                        style: "destructive",
                        onPress: async () => {
                            try {
                                const desvincularResposta = await desvincularSubTarefa(tarefaPaiId, Number(id));

                                if (desvincularResposta.status !== 200) {
                                    console.error("Erro ao desvincular:", desvincularResposta);
                                    Alert.alert("Erro na Desvinculação", "Não foi possível desvincular da tarefa pai atual. A nova vinculação não será tentada.");
                                    await carregarTarefa(); 
                                    return; 
                                }
                                
                                const vincularResposta = await vincularSubTarefa(tarefaPai, Number(id));
                                if (vincularResposta.status === 200) {
                                    Alert.alert("Sucesso", "Tarefa pai atualizada com sucesso!");
                                } else {
                                    console.error("Erro ao vincular", vincularResposta);
                                    Alert.alert("Erro na Vinculação", "Desvinculada da tarefa pai anterior, mas não foi possível vincular à nova tarefa pai.");
                                }
                                await carregarTarefa();
                            } catch (error) {
                                console.error("Erro ao substituir tarefa pai:", error);
                                Alert.alert("Erro", `Ocorreu um erro durante a substituição: ${error instanceof Error ? error.message : String(error)}`);
                                await carregarTarefa(); 
                            }
                        }
                    }
                ],
                { cancelable: true }
            );
        } else {
            console.log('passou direto')
            try {
                const resposta = await vincularSubTarefa(tarefaPai, Number(id));
                if (resposta.status === 200) {
                    console.log("Tarefa-pai vinculada com sucesso");
                    await carregarTarefa();
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    const onShare = async () => {
        if (!tarefa) return;
        try {
            const url = Linking.createURL(`home/tarefa/${id}`);
            await Share.share({
                title: `Tarefa: ${tarefa.titulo}`,
                message: `Confira esta tarefa no Task-Flow: ${tarefa.titulo}\n${url}`,
                url: url
            });
        } catch (error) {
            Alert.alert("Erro", "Não foi possível compartilhar a tarefa.");
        }
    };
    
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
                    <View style={style.headerButtons}>
                        <Text style={style.title}>{tarefa?.titulo}</Text>

                        <Button
                            icon="share-variant"
                            onPress={onShare}
                            disabled={isEditing}
                            labelStyle={{ fontSize: 16, fontWeight: "bold" }}
                        >
                            Compartilhar
                        </Button>
                    </View>
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
                            {tarefa?.dataInicio && timeSpentInfo.displayText && (
                                <>
                                    {tarefa?.tempoEstimado && <Text style={{color: "grey", fontSize: 16, fontWeight: "bold"}}> / </Text>}
                                    <View style={{marginRight: 2, marginLeft: tarefa?.tempoEstimado ? 2 : 4 }}>
                                        <Icon 
                                            source="progress-clock" 
                                            size={16} 
                                            color={timeSpentInfo.isOverEstimate ? "red" : "grey"}
                                        />
                                    </View>
                                    <Text style={{
                                        fontWeight: "bold", 
                                        fontSize: 16, 
                                        color: timeSpentInfo.isOverEstimate ? "red" : "grey"
                                    }}>
                                        {timeSpentInfo.displayText}
                                    </Text>
                                </>
                            )}
                        </View>
                        <Text style={[style.prazo, {marginBottom: 5}]}>Criada em: {formatDateTime(tarefa?.dataCriacao)}</Text>
                        <Text style={[style.prazo, {marginBottom: 5}]}>Iniciada em: {tarefa?.dataInicio? formatDateTime(tarefa?.dataInicio) : "Não foi iniciada"}</Text>
                        <Text style={[style.prazo, {marginBottom: 5}]}>Concluída em: {tarefa?.dataConclusao? formatDateTime(tarefa?.dataConclusao) : "Não foi concluída"}</Text>
                    </>
                )}
                <View style={style.infoContainer}>{tarefa?.prioridade && <PrioridadeComponent prioridade={tarefa?.prioridade} isEditable={true} onPrioridadeChange={trocarPrioridade} /> }
                    {tarefa?.status && <StatusComponent status={tarefa?.status} isEditable={true} onStatusChange={trocarStatus} /> }
                    <CategoriaComponent categoria={tarefa?.categoria?? null} isEditable={true} onCategoriaChange={trocarCategoria} />
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
                
                <View style={style.subtarefaHeader}>
                    <Text style={style.descricaoTitle}>Tarefa-Pai</Text>
                    {tarefa && !isEditing &&(
                         <AdicionarSubTarefaComponent 
                            tarefaPai={tarefa}
                            carregarTarefa={carregarTarefa} 
                            handleVincularSubTarefa={handleVincularTarefaPai}
                            escolherTarefaPai={true}
                        ></AdicionarSubTarefaComponent>
                    )}
                </View>
                { tarefa?.tarefaPai ? (
                        <SubTarefasComponent item={tarefa?.tarefaPai} onPress={handleNavegarSubTarefa} handleDesvincular={handleDesvincularTarefaPai}/>
                    ) : (
                        <View style={style.emptyListContainer}>
                            <Icon source="subdirectory-arrow-right" size={20} color="#9e9e9e" />
                            <Text style={style.emptyListText}>Essa tarefa não possui uma tarefa-pai</Text>
                        </View>
                    )}
                
                <View style={style.subtarefaHeader}>
                    <Text style={style.descricaoTitle}>Sub-Tarefas</Text>
                    {tarefa && !isEditing &&(
                         <AdicionarSubTarefaComponent 
                            tarefaPai={tarefa}
                            carregarTarefa={carregarTarefa} 
                            handleVincularSubTarefa={handleVincularSubTarefa}
                        ></AdicionarSubTarefaComponent>
                    )}
                </View>
                <FlatList
                    data={tarefa?.subTarefas || []}
                    renderItem={({ item }) => (
                        <SubTarefasComponent item={item} onPress={handleNavegarSubTarefa} handleDesvincular={handleDesvincularSubTarefa}/>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    scrollEnabled={false}
                    ListEmptyComponent={
                        <View style={style.emptyListContainer}>
                            <Icon source="subdirectory-arrow-right" size={20} color="#9e9e9e" />
                            <Text style={style.emptyListText}>Nenhuma sub-tarefa adicionada</Text>
                        </View>
                    }
                />
                
                <Text style={[style.descricaoTitle, { marginTop: 10}]}>Anexos</Text>
                <FlatList
                    data={tarefa?.anexos || []}
                    renderItem={({ item }) => <AnexoComponent anexo={item} onDelete={handleExcluirAnexo} />}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={style.anexoListContainer}
                    ListEmptyComponent={
                        <View style={style.emptyAnexosContainer}>
                            <Icon source="paperclip" size={20} color="#9e9e9e" />
                            <Text style={style.emptyAnexosText}>Nenhum anexo adicionado</Text>
                        </View>
                    }
                />
                <AdicionarAnexoComponent id={Number(id)} carregarTarefa={carregarTarefa}/>
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
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 0,
        width: '100%',
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
    subtarefaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 10, 
    },
    emptyListContainer: {
        // height: 60,
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'center',
        // backgroundColor: '#f5f5f5',
        // borderRadius: 8,
        // paddingHorizontal: 15,
        // marginVertical: 10,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyListText: {
        fontSize: 14,
        color: '#9e9e9e',
        marginLeft: 8,
    },
    separator: {
        height: 8, 
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
    anexoListContainer: {
        paddingVertical: 10,
    },
    anexoItemContainer: { 
        marginRight: 10,
        alignItems: 'center',
        width: 100, 
    },
    emptyAnexosContainer: {
        height: 50, 
        width: 200, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingHorizontal: 15,
    },
    emptyAnexosText: {
        fontSize: 14,
        color: '#9e9e9e',
        marginLeft: 8,
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },
    // emptyListContainer: {
    //     alignItems: "center",
    //     justifyContent: "center",
    //     padding: 20,
    // },
    // emptyListText: {
    //     fontSize: 16,
    //     color: "#9e9e9e",
    // },
});