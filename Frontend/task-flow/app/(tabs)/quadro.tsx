import { useEffect, useMemo, useState } from "react";
import { VisualizarTarefa } from "@/types/TarefaInteface";
import { ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import ListarTarefas from "@/services/tarefas/listarTarefasService";
import { FiltrosOptions } from "@/types/FiltrosInterface";
import dateComparer from "@/utils/dateComparer";
import FilterModal from "@/components/modalFilter";
import { DraxProvider, DraxView, DraxList } from "react-native-drax";
import TaskItemComponent from "@/components/taskItemComponent";
import { Button } from "react-native-paper";

const ItemTarefa = ({ tarefa, isDragging }: { tarefa: VisualizarTarefa; isDragging?: boolean }) => (
    <TaskItemComponent tarefa={tarefa} onPress={() => {}}/>
)

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

    useEffect(() => {
        async function carregarTarefas() {
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
        }

        carregarTarefas();
    }, []);
    
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
                contentContainerStyle={{ flexGrow: 1}}
            >
                {tasksForColumn.map(tarefa => (
                    <DraxView
                        key={tarefa.id}
                        style={styles.draggableTask}
                        draggingStyle={styles.dragging}
                        dragReleasedStyle={styles.dragging}
                        hoverDraggingStyle={styles.hoverDragging}
                        dragPayload={tarefa} 
                        longPressDelay={150} 
                        onDragStart={() => console.log(`Start dragging ${tarefa.titulo}`)}
                        // onDragEnd={() => console.log('Drag ended')}
                    >
                        <View>
                            <ItemTarefa tarefa={tarefa} />
                        </View>
                    </DraxView>
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
        <DraxProvider>
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
                    <DraxView
                        style={columnStyle}
                        receivingStyle={styles.columnReceiving}
                        onReceiveDragDrop={handleDrop}
                        payload="naoiniciada" 
                    >
                        <Text style={styles.columnTitle}>Não Iniciadas</Text>
                        {renderColumnContent(naoIniciadas, "naoiniciada")}
                    </DraxView>

                    <DraxView
                        style={columnStyle}
                        receivingStyle={styles.columnReceiving}
                        onReceiveDragDrop={handleDrop}
                        payload="emandamento"
                    >
                        <Text style={styles.columnTitle}>Em Andamento</Text>
                        {renderColumnContent(emAndamento, "emandamento")}
                    </DraxView>

                    <DraxView
                        style={columnStyle}
                        receivingStyle={styles.columnReceiving}
                        onReceiveDragDrop={handleDrop}
                        payload="concluida"
                    >
                        <Text style={styles.columnTitle}>Concluídas</Text>
                        {renderColumnContent(concluidas, "concluida")}
                    </DraxView>
                </ScrollView>
            </View>
        </DraxProvider>
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
        height: '100%', // Make column take full height of the ScrollView content
        minHeight: 600, // Ensure columns have some height
    },
    columnPortrait: {
        width: 300,
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
    columnReceiving: {
        borderColor: 'blue',
        borderWidth: 2,
    },
    draggableTask: {
        padding: 2, // Small padding so hover/dragging styles are visible around the card
        marginBottom: 8,
    },
    draggingCard: { // Style for the original card while an instance of it is being dragged
        opacity: 0.3,
    },
    dragging: { // Style for the item being dragged
        opacity: 0.8,
        transform: [{ scale: 1.05 }],
        elevation: 5,
    },
    hoverDragging: { // Style for the item being dragged when it's hovering over a receiver
        borderColor: 'green',
        borderWidth: 2,
    },
})