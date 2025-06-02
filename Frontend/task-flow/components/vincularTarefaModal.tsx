import ListarTarefas from "@/services/tarefas/listarTarefasService";
import { VisualizarTarefa } from "@/types/TarefaInteface";
import { useEffect, useMemo, useState } from "react";
import { View, Modal, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Appbar, TextInput, Text, Button, Divider, List, useTheme } from 'react-native-paper';
import TaskItemComponent from "./taskItemComponent";

type Props = {
    visible: boolean;
    onDismiss: () => void;
    onTarefaSelecionada: (tarefaId: number) => void;
    tarefaPai: VisualizarTarefa
}

export default function VincularTarefaModal(props: Props) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tarefas, setTarefas] = useState<VisualizarTarefa[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<VisualizarTarefa[]>([]);
    const theme = useTheme();

    useEffect(() => {
        const fetchTarefas = async () => {
            try {
                const response = await ListarTarefas();
                setTarefas(response.data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro desconhecido');
            } finally {
                setIsLoading(false);
            }
        };

        if (props.visible) {
            fetchTarefas();
        } else {
            setTarefas([]);
            setSearchQuery('');
            setSearchResults([]);
            setError(null);
            setIsLoading(true);
        }
    }, [props.visible]);
    
    useMemo(() => {
        const tarefasFiltradas = tarefas.filter(tarefa => {
            if (tarefa.id === props.tarefaPai.id) {
                return false; 
            }
            if (props.tarefaPai.subTarefas && props.tarefaPai.subTarefas.some(sub => sub.id === tarefa.id)) {
                return false; 
            }
            
            if (props.tarefaPai.tarefaPai?.id && tarefa.tarefaPai?.id === props.tarefaPai.id) {
                return false; 
            }

            if (searchQuery.trim() === '') {
                return true; 
            }

            const matchesTitle = tarefa.titulo.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDescription = tarefa.descricao ? tarefa.descricao.toLowerCase().includes(searchQuery.toLowerCase()) : false;

            return matchesTitle || matchesDescription;
        });
        setSearchResults(tarefasFiltradas);
    }, [searchQuery, tarefas, isLoading, props.tarefaPai, props.visible]);
    
    const handleSelectTarefa = (tarefaId: number) => {
        props.onTarefaSelecionada(tarefaId);
        props.onDismiss();
    }
    
    const renderItem = ({ item }: { item: VisualizarTarefa }) => {
        return (
          <TaskItemComponent
            tarefa={item}
            onPress={() => handleSelectTarefa(item.id)}
            />
        );
      }

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={props.visible}
            onRequestClose={props.onDismiss}
        >
            <View style={[styles.container, { backgroundColor: theme.colors.elevation.level1 }]}>
                <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
                    <Appbar.Action icon="close" onPress={props.onDismiss} />
                    <Appbar.Content title="Vincular Tarefa Existente"  />
                </Appbar.Header>

                <View style={styles.searchContainer}>
                    <TextInput
                        label="Pesquisar tarefa..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        mode="outlined"
                        left={<TextInput.Icon icon="magnify" />}
                        autoFocus
                    />
                </View>

                {isLoading && <ActivityIndicator animating={true} size="large" style={styles.loader} />}
                {error && <Text style={styles.errorText}>{error}</Text>}

                {!isLoading && !error && searchResults.length === 0 && searchQuery.length > 0 && (
                    <Text style={styles.emptyText}>Nenhuma tarefa encontrada para "{searchQuery}"</Text>
                )}
                 {!isLoading && !error && searchResults.length === 0 && searchQuery.length === 0 && (
                    <Text style={styles.emptyText}>Digite para pesquisar tarefas.</Text>
                )}

                <FlatList
                    data={searchResults}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    ItemSeparatorComponent={() => <Divider />}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={() => (
                        <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
                    )}
                />
                 <Button
                    mode="outlined"
                    onPress={props.onDismiss}
                    style={styles.cancelButton}
                >
                    Cancelar
                </Button>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    searchContainer: {
        padding: 16,
    },
    loader: {
        marginTop: 20,
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        marginTop: 20,
        paddingHorizontal: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: 'grey',
        marginTop: 20,
        paddingHorizontal: 16,
    },
    listItem: {
        paddingHorizontal: 16,
    },
    statusCircle: {
        marginRight: 8,
        alignSelf: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
    cancelButton: {
        margin: 16,
    }
});