import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { VisualizarTarefa } from "@/types/TarefaInteface";
import { RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import ListarTarefas from "@/services/tarefas/listarTarefasService";
import { FiltrosOptions } from "@/types/FiltrosInterface";
import dateComparer from "@/utils/dateComparer";
import FilterModal from "@/components/modalFilter";
import { Button, Icon } from "react-native-paper";
import PrioridadeComponent from "@/components/prioridadeComponent";
import StatusComponent from "@/components/statusComponent";
import formatPrazo from "@/utils/dateTimeParser";
import { useRouter } from "expo-router";

const ItemTarefa = ({ tarefa }: { tarefa: VisualizarTarefa }) => {
    const router = useRouter();

    const handleSimpleTap = () => {
        console.log("Simple tap for navigation");
        router.push(`/home/tarefa/${tarefa.id}`);
    };

    return (

        <TouchableOpacity onPress={handleSimpleTap} style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.titulo}>{tarefa.titulo}</Text>
                <View style={styles.infoContainer}>
                    {tarefa?.prioridade && <PrioridadeComponent prioridade={tarefa?.prioridade} isEditable={false} />}
                    {tarefa?.status && <StatusComponent status={tarefa?.status} isEditable={false} />}
                    <View style={styles.dataContainer}>
                        <Icon source="calendar-alert" size={24} color="#000"/>
                        <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 4, color: "grey" }}>
                            {formatPrazo(tarefa?.prazo)}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function TelaQuadro() {
    const [tarefas, setTarefas] = useState<VisualizarTarefa[]>([]);
    const [naoIniciadas, setNaoIniciadas] = useState<VisualizarTarefa[]>([]);
    const [emAndamento, setEmAndamento] = useState<VisualizarTarefa[]>([]);
    const [concluidas, setConcluidas] = useState<VisualizarTarefa[]>([]);
    
    const [termoBusca, setTermoBusca] = useState<string>("");
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [currentFilters, setCurrentFilters] = useState<FiltrosOptions>({
        prioridade: null, status: null, prazo: null, categoria: null
    });
    
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    

     const tarefasFiltradas = useMemo(() => {
          return tarefas.filter((tarefa) => {
            
            if (termoBusca && !tarefa.titulo.toLowerCase().includes(termoBusca.toLowerCase())) {
                return false;
            }

            if (currentFilters.prioridade && tarefa.prioridade !== currentFilters.prioridade) {
              return false;
            }
        
            if (currentFilters.categoria && (!tarefa.categoria?.id || tarefa.categoria?.id !== currentFilters.categoria.id)) {
              return false;
            }
    
            if (currentFilters.prazo) {
              let prazoVerificado = dateComparer(currentFilters?.prazo, tarefa.prazo, currentFilters?.dataPersonalizada? currentFilters.dataPersonalizada : null)
              if (prazoVerificado === false) {
                return false;
              }
            }
            
            return true
        });
      }, [tarefas, currentFilters, termoBusca]);

    const carregarTarefas = useCallback(async () => {
        setError(null);
        try {
            const resposta = await ListarTarefas();
            if (resposta.status !== 200) {
                setError("Erro ao carregar tarefas");
                return;
            }
            setTarefas(resposta.data);
        } catch (error) {
            console.error(error);
            setError("Erro ao carregar tarefas: " + (error as Error).message || "Erro desconhecido");
        }
    }, []);

    const onRefreshTasks = useCallback(async () => {
        setRefreshing(true);
        await carregarTarefas();
        setRefreshing(false);
    }, [carregarTarefas]);
    
    useEffect(() => {
        carregarTarefas();
    }, [carregarTarefas]);
    
    function filtrarTarefasStatus(status: string): VisualizarTarefa[] {
        return tarefasFiltradas.filter(tarefa => tarefa.status === status);
    }

    useEffect(() => {
        setNaoIniciadas(filtrarTarefasStatus("naoiniciada"));
        setEmAndamento(filtrarTarefasStatus("emandamento"));
        setConcluidas(filtrarTarefasStatus("concluida"));
    }, [tarefasFiltradas]);

    const handleApplyFilters = (appliedFilters: FiltrosOptions) => {
        setCurrentFilters(appliedFilters); 
        setFilterModalVisible(false);
    };

    const handleDrop = (
        event: { dragged: { payload: VisualizarTarefa }; receiver: { payload: string } }
    ) => {
        const draggedTask = event.dragged.payload;
        const targetStatus = event.receiver.payload;

        if (draggedTask.status?.toLowerCase() === targetStatus.toLowerCase()) {
            return; 
        }

        setTarefas(prevTarefas =>
            prevTarefas.map(task =>
                task.id === draggedTask.id ? { ...task, status: targetStatus } : task
            )
        );
        // The useEffect listening to tarefasFiltradas will update naoIniciadas, emAndamento, concluidas
        // You might want to call an API to update the task status on the backend here
        // Ex: await AtualizarStatusTarefa(draggedTask.id, targetStatus);
    };

    const columnStyle = [
        styles.column,
        isLandscape ? styles.columnLandscape : styles.columnPortrait
    ];
    
    const renderColumnContent = (tasksForColumn: VisualizarTarefa[], columnStatus: string) => {
        return (
            <ScrollView
                style={{ flex: 1}}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefreshTasks}
                        colors={["#1e90ff"]} 
                        tintColor={"#1e90ff"} 
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {tasksForColumn.map(tarefa => (
                    <ItemTarefa 
                        key={tarefa.id}
                        tarefa={tarefa}
                    />
                ))}
            </ScrollView>
        );
    };
    
    if (error) {
        return (
            <>
                <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
            </>
        );
    }
    
    return (
            <View style={styles.fullScreen}>   
                <View style={styles.filterBar}>
                    <TextInput
                        placeholder="Buscar tarefas..."
                        value={termoBusca}
                        onChangeText={setTermoBusca}
                        style={styles.searchInput}
                    />
                    <Button onPress={() => setFilterModalVisible(true)} mode="outlined">Filtros</Button>
                </View>
                <FilterModal
                    visible={filterModalVisible}
                    onDismiss={() => setFilterModalVisible(false)}
                    currentFilters={currentFilters} 
                    onApplyFilters={handleApplyFilters}
                />

                <ScrollView horizontal contentContainerStyle={styles.boardContainer} style={{ flexGrow: 1 }}>
                    <View style={[styles.column, columnStyle]}>
                        <Text style={styles.columnTitle}>Não Iniciadas</Text>
                        {renderColumnContent(naoIniciadas, "naoiniciada")}
                    </View>
                    <View style={[styles.column, columnStyle]}>
                        <Text style={styles.columnTitle}>Em Andamento</Text>
                        {renderColumnContent(emAndamento, "emandamento")}
                    </View>
                    <View style={[styles.column, columnStyle]}>
                        <Text style={styles.columnTitle}>Concluídas</Text>
                        {renderColumnContent(concluidas, "concluida")}
                    </View>
                </ScrollView>
            </View>
    )
}

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    filterBar: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    searchInput: {
        flex: 1,
        marginRight: 10,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    boardContainer: {
        flexGrow: 1,
        paddingVertical: 10,
    },
    column: {
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        marginHorizontal: 5,
        padding: 10,
        height: '99%',
        justifyContent: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
    },
    columnPortrait: {
        width: 320,
    },
    columnLandscape: {
        width: 380, 
    },
    columnTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
    },
    container: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    titulo: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
    descricao: {
        fontSize: 16,
    },
    infoContainer: {
        flexDirection: "row",
        width: "100%",
        height: 24,
    },
    dataContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: "auto",
    },
})