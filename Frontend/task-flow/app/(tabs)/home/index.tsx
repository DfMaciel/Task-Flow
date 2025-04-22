// app/home.tsx

import { View, Text, Button, StyleSheet, FlatList, RefreshControl } from "react-native";
import AdicionarIcon from "@/components/adicionarIcon";
import { VisualizarTarefa } from "@/types/TarefaInteface";
import { useEffect, useMemo, useState } from "react";
import ListarTarefas from "@/services/tarefas/listarTarefasService";
import TaskItemComponent from "@/components/taskItemComponent";
import { router, useLocalSearchParams } from "expo-router";
import { FiltrosOptions } from "@/types/FiltrosInterface";
import { IconButton } from "react-native-paper";
import FilterModal from "@/components/modalFilter";

const TelaHome = () => {
  const [tarefas, setTarefas] = useState<VisualizarTarefa[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { filters } = useLocalSearchParams();
  
    async function carregarTarefas() {
      console.log("Buscando tarefas")
      try {
        const resposta = await ListarTarefas();
        setTarefas(resposta.data);
      } catch (error) {
        console.error(error);
      }
    }

  useEffect(() => {
    carregarTarefas();
  }, []);

  const currentFilters: FiltrosOptions = useMemo(() => {
    try {
      return filters ? JSON.parse(filters as string) : { prioridade: null, status: null, prazo: null, categoria: null };
    } catch (e) {
      console.error("Failed to parse filters:", e);
      return { prioridade: null, status: null, prazo: null, categoria: null }; // Fallback on parse error
    }
  }, [filters]);
  
  const tarefasFiltradas = useMemo(() => {
      return tarefas.filter((tarefa) => {
        // Check prioridade filter
        if (currentFilters.prioridade && tarefa.prioridade !== currentFilters.prioridade) {
          return false;
        }
    
        // Check status filter
        if (currentFilters.status && tarefa.status !== currentFilters.status) {
          return false;
        }
    
        // Check categoria filter (add null check for tarefa.categoria if it's optional)
        if (currentFilters.categoria && (!tarefa.categoria || tarefa.categoria !== currentFilters.categoria)) {
          return false;
        }
    });
  }, [tarefas, currentFilters]);
  
  const onRefresh = async () => {
    setRefreshing(true); // Show the loading spinner
    await carregarTarefas(); // Reload the tasks
    setRefreshing(false); // Hide the loading spinner
  };
  
  const renderItem = ({ item }: { item: VisualizarTarefa }) => {
    return (
      <TaskItemComponent
        tarefa={item}
        onPress={() => {
          router.push(`/home/tarefa/${item.id}`);
        }}
        />
    );
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Bem vindo de volta!</Text>
      <Text style={styles.tarefasSubTitle}>Suas tarefas:</Text>
      <FlatList
        data={tarefasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <AdicionarIcon/>
    </View>
  );
};

export default TelaHome;

const styles = StyleSheet.create({
  listContainer: {
    padding: 16
  },
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    paddingTop: 20,
  },
  button: {
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
  },
  tarefasSubTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 40,
    alignSelf: "flex-start",
  },
});
