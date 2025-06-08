import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

interface NotificationContent {
  title: string;
  body: string;
  data?: Record<string, any>;
}

interface ScheduleOptions {
  date: Date;
  repeats?: boolean;
  frequency?: 'nenhuma' | 'diaria' | 'semanal' | 'mensal';
  daysOfWeek?: number[]; 
  dayOfMonth?: number;  
}

export default async function scheduleNotification(
  content: NotificationContent,
  options: ScheduleOptions
): Promise<string[] | null> {

  if (options.date <= new Date() && options.frequency === 'nenhuma') {
    Alert.alert("Data Inválida", "A data do lembrete deve ser no futuro.");
    return null;
  }

  let triggerInput: Notifications.NotificationTriggerInput = null; 
  
  if (options.repeats && options.frequency !== 'nenhuma') {
    const initialTriggerDate = options.date;

    switch (options.frequency) {
      case 'diaria':
        triggerInput = { 
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: initialTriggerDate.getHours(), 
          minute: initialTriggerDate.getMinutes(), 
        } as Notifications.DailyTriggerInput;
        break;
      case 'semanal':
        if (options.daysOfWeek && options.daysOfWeek.length > 0) {
          const ids: string[] = [];
          for (const day of options.daysOfWeek) {
            const validDay = Math.max(1, Math.min(7, day)); 
            const weeklyTrigger: Notifications.WeeklyTriggerInput = { 
                type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                weekday: validDay, 
                hour: initialTriggerDate.getHours(), 
                minute: initialTriggerDate.getMinutes(), 
            };
            try {
                const id = await Notifications.scheduleNotificationAsync({
                content,
                trigger: weeklyTrigger,
                });
                ids.push(id);
            } catch (e) {
                console.error(`Failed to schedule weekly notification for day ${validDay}:`, e);
            }
          }
          if (ids.length > 0) {
            console.log(`Notificações semanais agendadas: ${ids.join(', ')} para ${initialTriggerDate.toLocaleTimeString()}`);
            return ids;
          } else {
            Alert.alert("Erro", "Não foi possível agendar lembretes semanais.");
            return null;
          }
        } else {
           Alert.alert("Erro", "Dias da semana não especificados para lembrete semanal.");
           return null;
        }
        return null;
      case 'mensal':
        if (options.dayOfMonth && options.dayOfMonth >= 1 && options.dayOfMonth <= 31) {
          triggerInput = {
            type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
            dateComponents: { 
                day: options.dayOfMonth,
                hour: initialTriggerDate.getHours(),
                minute: initialTriggerDate.getMinutes()
            },
            repeats: true
          } as Notifications.CalendarTriggerInput;
        } else {
            Alert.alert("Erro", "Dia do mês não especificado para lembrete mensal.");
            return null;
        }
        break;
      default: 
        console.warn(`Unhandled frequency with repeats: ${options.frequency}`);
        triggerInput = options.date as unknown as Notifications.NotificationTriggerInput; 
        break;
    }
  } else {
    triggerInput = options.date as unknown as Notifications.NotificationTriggerInput; 
  }

  if (options.frequency === 'semanal' && options.repeats && options.daysOfWeek && options.daysOfWeek.length > 0) {
    return null; 
  }

  if (triggerInput === null && !(options.frequency === 'semanal' && options.repeats)) {
    console.error("Trigger input was not set correctly.");
    Alert.alert("Erro", "Não foi possível determinar o gatilho da notificação.");
    return null;
  }

  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content,
      trigger: triggerInput, 
    });
    console.log(`Notificação agendada: ${notificationId} para ${options.date.toLocaleString()} com trigger:`, triggerInput);
    return [notificationId];
  } catch (error) {
    console.error("Erro ao agendar notificação:", error);
    Alert.alert("Erro", "Não foi possível agendar a notificação.");
    return null;
  }
}