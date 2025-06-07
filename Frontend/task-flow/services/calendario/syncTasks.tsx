import { VisualizarTarefa } from "@/types/TarefaInteface";
import { Alert } from "react-native";
import requestCalendarPermissions from "./requestPermission";
import getOrCreateAppCalendarId from "./getCreateCalendar";
import addSingleTaskToDeviceCalendar from "./addTaskCalendar";

export async function syncAllTasksToExternalCalendar(
  tasks: VisualizarTarefa[]
): Promise<{ successCount: number; failureCount: number; skippedCount: number; messages: string[] }> {
  let successCount = 0;
  let failureCount = 0;
  let skippedCount = 0;
  const operationMessages: string[] = [];

  const hasPermission = await requestCalendarPermissions();
  if (!hasPermission) {
    Alert.alert(
        "Permissão Necessária",
        "Para sincronizar tarefas, por favor, conceda a permissão de acesso ao calendário nas configurações do seu dispositivo."
    );
    operationMessages.push("Permissão ao calendário negada.");
    return { successCount, failureCount, skippedCount, messages: operationMessages };
  }

  const calendarId = await getOrCreateAppCalendarId();
  if (!calendarId) {
    operationMessages.push("Não foi possível obter ou criar um ID de calendário.");
    return { successCount, failureCount, skippedCount, messages: operationMessages };
  }
  
  const tasksWithPrazo = tasks.filter(t => t.prazo);
  if (tasksWithPrazo.length === 0) {
    Alert.alert("Nenhuma Tarefa", "Não há tarefas com prazo para sincronizar.");
    return { successCount, failureCount, skippedCount: tasks.length, messages: operationMessages };
  }

  Alert.alert("Sincronização Iniciada", `Tentando sincronizar ${tasksWithPrazo.length} tarefas com o calendário...`);

  for (const task of tasks) {
    if (task.prazo) {
      const result = await addSingleTaskToDeviceCalendar(task, calendarId);
      if (result.success) {
        successCount++;
        if (result.message) operationMessages.push(`Tarefa "${result.taskTitle}": ${result.message}`);
      } else {
        failureCount++;
        operationMessages.push(`Tarefa "${result.taskTitle}": ${result.message || 'falha desconhecida.'}`);
      }
    } else {
        skippedCount++;
        operationMessages.push(`Tarefa "${task.titulo}" ignorada (sem prazo).`);
    }
  }
  return { successCount, failureCount, skippedCount, messages: operationMessages };
}