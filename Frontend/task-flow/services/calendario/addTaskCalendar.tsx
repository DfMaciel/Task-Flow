import { VisualizarTarefa } from "@/types/TarefaInteface";
import * as Localization from "expo-localization";
import * as Calendar from "expo-calendar";

interface AddTaskResult {
  success: boolean;
  message?: string;
  eventId?: string;
  taskTitle: string;
}

type EventCreationDetails = Partial<Omit<Calendar.Event, 'id' | 'calendarId'>>;

export default async function addSingleTaskToDeviceCalendar(
  tarefa: VisualizarTarefa,
  calendarId: string
): Promise<AddTaskResult> {
  if (!tarefa.prazo) {
    return { success: false, message: `sem prazo.`, taskTitle: tarefa.titulo };
  }

  const parts = tarefa.prazo.split('-');
  let startDate: Date;
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    startDate = new Date(year, month, day, 9, 0, 0); 
  } else {
    return { success: false, message: `data do prazo inválida.`, taskTitle: tarefa.titulo };
  }
  
  if (isNaN(startDate.getTime())) {
    return { success: false, message: `data do prazo inválida.`, taskTitle: tarefa.titulo };
  }

  const endDate = new Date(startDate.getTime() + (Number(tarefa.tempoEstimado) || 60) * 60 * 1000);
  const timeZone = Localization.getCalendars()[0]?.timeZone || Localization.timezone;
  const eventTitle = `[Task Flow] ${tarefa.titulo}`;

  const eventDetails: EventCreationDetails = {
    title: eventTitle,
    notes: tarefa.descricao || '',
    startDate: startDate,
    endDate: endDate,
    timeZone: timeZone,
  };

  try {
    const searchStartDate = new Date(startDate.getTime() - 5 * 60 * 1000); 
    const searchEndDate = new Date(endDate.getTime() + 5 * 60 * 1000); 
    const existingEvents = await Calendar.getEventsAsync([calendarId], searchStartDate, searchEndDate);
    
    const alreadyExists = existingEvents.some(event => 
        event.title === eventTitle && 
        Math.abs(new Date(event.startDate).getTime() - startDate.getTime()) < 60000 
    );

    if (alreadyExists) {
      console.log(`Event for "${tarefa.titulo}" already exists. Skipping.`);
      return { success: true, message: "já existe no calendário.", taskTitle: tarefa.titulo };
    }

    const eventId = await Calendar.createEventAsync(calendarId, eventDetails);
    return { success: true, eventId: eventId, taskTitle: tarefa.titulo };
  } catch (e: any) {
    console.error(`Failed to create event for "${tarefa.titulo}":`, e);
    return { success: false, message: `erro ao criar evento: ${e.message}`, taskTitle: tarefa.titulo };
  }
}