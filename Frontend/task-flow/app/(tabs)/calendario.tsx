import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Calendar, LocaleConfig, Agenda } from 'react-native-calendars';
import { useTheme, List, Button } from 'react-native-paper';
import { VisualizarTarefa } from '../../types/TarefaInteface'; 
import ListarTarefas from '@/services/tarefas/listarTarefasService';
import formatToDdMmYyyy from '@/utils/formatToDdMmYyyy';
import { useRouter } from 'expo-router';
import { syncAllTasksToExternalCalendar } from '@/services/calendario/syncTasks';

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

interface MarkedDatesType {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    activeOpacity?: number;
    selected?: boolean;
    selectedColor?: string;
    dots?: { key: string; color: string; selectedDotColor?: string }[];
  };
}

const formatDateToYyyyMmDd = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CalendarioScreen() {
  const theme = useTheme();
  const [tarefas, setTarefas] = useState<VisualizarTarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return formatDateToYyyyMmDd(today);
  });
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const fetchTarefas = async () => {
        try {
          setLoading(true);
          const response = await ListarTarefas();
          if (response.status === 200 && response.data) {
            setTarefas(response.data);
          } else {
            console.error("Erro ao buscar tarefas:", response.data?.message || "Erro desconhecido");
            setTarefas([]);
          }
        } catch (error) {
          console.error("Exceção ao buscar tarefas:", error);
          setTarefas([]);
        } finally {
          setLoading(false);
        }
    };
    fetchTarefas();
  }, []);

  const markedDates = useMemo(() => {
    const marks: MarkedDatesType = {};
    tarefas.forEach(tarefa => {
      if (tarefa.prazo) {
        try {
          const parts = tarefa.prazo.split('-');
          if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            
            const dateObject = new Date(year, month, day);

            if (isNaN(dateObject.getTime())) {
              console.warn(`Invalid date components from prazo: ${tarefa.prazo} for task ${tarefa.titulo}`);
              return; 
            }
            const dateString = formatDateToYyyyMmDd(dateObject);        
          
          if (!marks[dateString]) {
            marks[dateString] = { dots: [] };
          }
          marks[dateString].dots?.push({ key: tarefa.id.toString(), color: theme.colors.primary });
          if (dateString === selectedDate) {
            marks[dateString].selected = true;
            marks[dateString].selectedColor = theme.colors.primaryContainer;
          }
          } else {
            console.warn(`Prazo string not in YYYY-MM-DD format: ${tarefa.prazo}`);
          }
        } catch (e) {
          console.warn(`Data inválida para tarefa ${tarefa.titulo}: ${tarefa.prazo}`);
        }
      }
    });
    if (selectedDate) {
        if (!marks[selectedDate]) {
            marks[selectedDate] = { dots: [] };
        }
        marks[selectedDate].selected = true;
        marks[selectedDate].selectedColor = theme.colors.primaryContainer; 
    }
    return marks;
  }, [tarefas, selectedDate, theme.colors.primary, theme.colors.primaryContainer]);


  const tasksForSelectedDate = useMemo(() => {
    return tarefas.filter(tarefa => {
      if (!tarefa.prazo) return false;
      try {
        const parts = tarefa.prazo.split('-');
        if (parts.length === 3) {
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; 
          const day = parseInt(parts[2], 10);

          const dateObject = new Date(year, month, day);

          if (isNaN(dateObject.getTime())) {
            return false;
          }
          return formatDateToYyyyMmDd(dateObject) === selectedDate;
        }
        return false; 
      } catch (e) {
        console.warn(`Error filtering prazo ${tarefa.prazo} for task ${tarefa.titulo}:`, e);
        return false;
      }
    });
  }, [tarefas, selectedDate]);

  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handleSyncTasks = async () => {
    if (isSyncing) return; 
    setIsSyncing(true);
    const { successCount, failureCount, skippedCount, messages } = await syncAllTasksToExternalCalendar(tarefas);
    
    let summary = `Sincronização Concluída:\n- ${successCount} tarefas sincronizadas com sucesso.\n`;
    if (failureCount > 0) {
      summary += `- ${failureCount} tarefas falharam ao sincronizar.\n`;
    }
    if (skippedCount > 0) {
      summary += `- ${skippedCount} tarefas ignoradas (sem prazo).\n`;
    }

    if (messages.length > 0 && failureCount > 0) { 
        console.log("Detalhes da sincronização:\n" + messages.filter(msg => msg.includes("falha") || msg.includes("erro")).join("\n"));
    }
    
    Alert.alert("Resultado da Sincronização", summary);
    setIsSyncing(false);
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
  }

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate}
        onDayPress={onDayPress}
        markedDates={markedDates}
        markingType={'multi-dot'}
        monthFormat={'MMMM yyyy'}
        theme={{
          arrowColor: theme.colors.primary,
          todayTextColor: theme.colors.primary,
          calendarBackground: theme.colors.background,
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: theme.colors.onPrimaryContainer,
          selectedDayTextColor: '#ffffff',
          dayTextColor: theme.colors.onSurface,
          textDisabledColor: theme.colors.onSurfaceDisabled,
          selectedDotColor: theme.colors.onPrimaryContainer,
        }}
        style={{ 
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.outlineVariant, 
          marginHorizontal: 8, 
          marginTop: 8,
          borderRadius: 8, 
          elevation: 1,
        }}
      />
      <ScrollView style={styles.taskList}>
        <Button
            icon="sync"
            mode="contained"
            style={styles.addButton}
            onPress={handleSyncTasks}
            disabled={isSyncing || loading || tarefas.length === 0}
          >
            {isSyncing ? "Sincronizando..." : "Sincronizar Tarefas com Calendário"}
          </Button>
        {tasksForSelectedDate.length > 0 ? (
          tasksForSelectedDate.map(tarefa => (
            <List.Item
              key={tarefa.id}
              title={tarefa.titulo}
              description={tarefa.descricao || 'Sem descrição'}
              left={props => <List.Icon {...props} icon="circle-small" color={theme.colors.primary} />}
              style={{ backgroundColor: theme.colors.surfaceVariant, marginBottom: 2, borderRadius: 4 }}
              titleStyle={{ color: theme.colors.onSurfaceVariant }}
              descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
                onPress={() => {
                    router.push(`/home/tarefa/${tarefa.id}`);
                }}
            />
          ))
        ) : (
          <View style={styles.centeredMessage}>
            <Text style={{color: theme.colors.onSurface}}>Nenhuma tarefa para {formatToDdMmYyyy(selectedDate)}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskList: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  centeredMessage: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  addButton: { 
    marginTop: 5,
    backgroundColor: "#6750A4",
    marginBottom: 15,
  },
});