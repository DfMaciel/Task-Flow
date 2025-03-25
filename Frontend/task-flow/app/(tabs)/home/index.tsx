// app/home.tsx

import { View, Text, Button, StyleSheet, FlatList, RefreshControl } from "react-native";
import AdicionarIcon from "@/components/adicionarIcon";
import { VisualizarTarefa } from "@/types/TarefaInteface";
import { useEffect, useState } from "react";
import ListarTarefas from "@/services/tarefas/listarTarefasService";
import TaskItemComponent from "@/components/taskItemComponent";
import { router } from "expo-router";

const TelaHome = () => {
  const [tarefas, setTarefas] = useState<VisualizarTarefa[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  
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
        data={tarefas}
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
