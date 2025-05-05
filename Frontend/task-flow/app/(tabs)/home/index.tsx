// app/home.tsx

import { View, Text, Button, StyleSheet, FlatList, RefreshControl } from "react-native";
import AdicionarIcon from "@/components/adicionarIcon";
import { VisualizarTarefa } from "@/types/TarefaInteface";
import { useEffect, useMemo, useState } from "react";
import ListarTarefas from "@/services/tarefas/listarTarefasService";
import TaskItemComponent from "@/components/taskItemComponent";
import { router } from "expo-router";
import { FiltrosOptions } from "@/types/FiltrosInterface";
import { IconButton } from "react-native-paper";
import FilterModal from "@/components/modalFilter";
import dateComparer from "@/utils/dateComparer";

const TelaHome = () => {
  const [tarefas, setTarefas] = useState<VisualizarTarefa[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FiltrosOptions>({
    prioridade: null, status: null, prazo: null, categoria: null
  });
  
    async function carregarTarefas() {
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

  const handleApplyFilters = (appliedFilters: FiltrosOptions) => {
    setCurrentFilters(appliedFilters); 
    setFilterModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <Text style={styles.title}>Bem vindo de volta!</Text>
        <IconButton
          icon="filter-outline"
          size={30}
          onPress={() => setFilterModalVisible(true)}
          style={styles.button}
          iconColor="#000"
          rippleColor="rgba(0, 0, 0, .32)"
        />
      </View>
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
      
      <FilterModal
        visible={filterModalVisible}
        onDismiss={() => setFilterModalVisible(false)}
        currentFilters={currentFilters} // Use local state
        onApplyFilters={handleApplyFilters}
      />
      
      <AdicionarIcon/>
    </View>
  );
};

export default TelaHome;

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 80
  },
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    paddingTop: 20,
  },
  button: {
    margin: 10,
    position: "absolute",
    right: 0,
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
