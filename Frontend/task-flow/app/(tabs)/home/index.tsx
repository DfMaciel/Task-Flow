// app/home.tsx

import { View, Text, Button, StyleSheet, FlatList, RefreshControl } from "react-native";
import AdicionarIcon from "@/components/adicionarIcon";
import { VisualizarTarefa } from "@/types/TarefaInteface";
import { useEffect, useMemo, useState } from "react";
import ListarTarefas from "@/services/tarefas/listarTarefasService";
import TaskItemComponent from "@/components/taskItemComponent";
import { router } from "expo-router";
import { FiltrosOptions } from "@/types/FiltrosInterface";
import { Card, DataTable, Divider, IconButton, Title } from "react-native-paper";
import FilterModal from "@/components/modalFilter";
import dateComparer from "@/utils/dateComparer";
import { calculateTimeSpent } from "@/utils/calculateTimeSpent";
import { ScrollView } from "react-native-gesture-handler";

const TelaHome = () => {
  const [tarefas, setTarefas] = useState<VisualizarTarefa[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [statisticsEnabled, setStatisticsEnabled] = useState(false);
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
  
  const handleStatisticsToggle = () => {
    setStatisticsEnabled(!statisticsEnabled);
  }
  
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

  const reportData = useMemo(() => {
        const concluidas = tarefas.filter(t => t.status === 'concluida' && t.dataInicio && t.dataConclusao);
        const emAndamento = tarefas.filter(t => t.status === 'emAndamento');
        const naoIniciadas = tarefas.filter(t => t.status === 'naoIniciada');

        let totalHorasGastas = 0;
        concluidas.forEach(t => {
            const timeInfo = calculateTimeSpent(t);
            if (timeInfo.hoursSpent) {
                totalHorasGastas += timeInfo.hoursSpent;
            }
        });

        return {
            total: tarefas.length,
            concluidasCount: concluidas.length,
            emAndamentoCount: emAndamento.length,
            naoIniciadasCount: naoIniciadas.length,
            totalHorasGastas: totalHorasGastas.toFixed(1),
            tarefasConcluidas: concluidas
        };
    }, [tarefas]);
  
  const tarefasContent = () => (
    <>
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
      </>
  );

  const estatisticasContent = () => (
    <ScrollView
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Title style={styles.estatisticasSubTitle}>Relatório de Tarefas</Title>

        <Card style={styles.card}>
            <Card.Content>
                <Title>Resumo Geral</Title>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Total de Tarefas:</Text><Text style={styles.summaryValue}>{reportData.total}</Text></View>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Concluídas:</Text><Text style={styles.summaryValue}>{reportData.concluidasCount}</Text></View>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Em Andamento:</Text><Text style={styles.summaryValue}>{reportData.emAndamentoCount}</Text></View>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Não Iniciadas:</Text><Text style={styles.summaryValue}>{reportData.naoIniciadasCount}</Text></View>
                <Divider style={styles.divider} />
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Total de Horas Gastas (Concluídas):</Text><Text style={styles.summaryValue}>{reportData.totalHorasGastas}h</Text></View>
            </Card.Content>
        </Card>

        <Card style={styles.card}>
            <Card.Content>
                <Title>Detalhes das Tarefas Concluídas</Title>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Tarefa</DataTable.Title>
                        <DataTable.Title numeric>Tempo Gasto</DataTable.Title>
                    </DataTable.Header>

                    {reportData.tarefasConcluidas.map(tarefa => (
                        <DataTable.Row key={tarefa.id}>
                            <DataTable.Cell>{tarefa.titulo}</DataTable.Cell>
                            <DataTable.Cell numeric>{calculateTimeSpent(tarefa).displayText}</DataTable.Cell>
                        </DataTable.Row>
                    ))}

                    {reportData.tarefasConcluidas.length === 0 && (
                        <Text style={styles.noDataText}>Nenhuma tarefa concluída ainda.</Text>
                    )}
                </DataTable>
            </Card.Content>
        </Card>
      </ScrollView>
  )

  const handleApplyFilters = (appliedFilters: FiltrosOptions) => {
    setCurrentFilters(appliedFilters); 
    setFilterModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <Text style={styles.title}>Bem vindo de volta!</Text>
        <IconButton
          icon={"chart-bar"}
          size={30}
          onPress={handleStatisticsToggle}
          style={[styles.button, { left: 0 }]}
          iconColor={statisticsEnabled ? "purple" : "#000"}
          rippleColor="rgba(0, 0, 0, .32)"
        />
        {!statisticsEnabled && (
          <IconButton
          icon="filter-outline"
          size={30}
          onPress={() => setFilterModalVisible(true)}
          style={styles.button}
          iconColor="#000"
          rippleColor="rgba(0, 0, 0, .32)"
        />
        )}
      </View>
        {statisticsEnabled ? (
            estatisticasContent()
          ) : (
            tarefasContent()
          )}
    </View>
  )
}


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
  estatisticasSubTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 15,
    alignSelf: "flex-start",
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginVertical: 16 
  },
  card: { 
    marginVertical: 8, 
    elevation: 2 
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 5 
  },
  summaryLabel: { 
    fontSize: 16 
  },
  summaryValue: { 
    fontSize: 16, 
    fontWeight: 'bold',
  },
  divider: { 
    marginVertical: 10 
  },
  noDataText: { 
    textAlign: 'center', 
    padding: 20, 
    color: 'grey' 
  }
});
