import * as Calendar from 'expo-calendar';
import { Platform, Alert } from 'react-native';
import { VisualizarTarefa } from '@/types/TarefaInteface'; 

export default async function getOrCreateAppCalendarId(): Promise<string | null> {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  
  const existingAppCalendar = calendars.find(cal => cal.title === 'Tarefas (Task Flow)' && cal.allowsModifications);
  if (existingAppCalendar) {
    console.log(`Using existing app calendar: ${existingAppCalendar.title} (ID: ${existingAppCalendar.id})`);
    return existingAppCalendar.id;
  }

  const primaryCalendar = calendars.find(cal => cal.isPrimary && cal.allowsModifications);
  if (primaryCalendar) {
    console.log(`Using primary modifiable calendar: ${primaryCalendar.title} (ID: ${primaryCalendar.id})`);
    return primaryCalendar.id;
  }

  if (Platform.OS === 'ios') {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    if (defaultCalendar && defaultCalendar.allowsModifications) {
      console.log(`Using iOS default modifiable calendar: ${defaultCalendar.title} (ID: ${defaultCalendar.id})`);
      return defaultCalendar.id;
    }
  }
  
  const anyModifiableCalendar = calendars.find(cal => cal.allowsModifications);
  if (anyModifiableCalendar) {
    console.log(`Using first available modifiable calendar: ${anyModifiableCalendar.title} (ID: ${anyModifiableCalendar.id})`);
    return anyModifiableCalendar.id;
  }

  try {
    console.log("No suitable modifiable calendar found. Attempting to create a new one for 'Task Flow'.");
    const sources = await Calendar.getSourcesAsync();
    let sourceToUse: Calendar.Source | undefined;

    if (Platform.OS === 'ios') {
        sourceToUse = sources.find(s => s.name === 'Default' || s.type === Calendar.SourceType.LOCAL || s.name === 'iCloud');
        if (!sourceToUse && sources.length > 0) sourceToUse = sources[0];
    } else {
        sourceToUse = sources.find(s => s.isLocalAccount || s.type === Calendar.SourceType.LOCAL) 
                      || { name: 'Task Flow App', isLocalAccount: true, type: Calendar.SourceType.LOCAL };
    }

    if (!sourceToUse) {
        console.error("No calendar source found to create a new calendar.");
        Alert.alert("Erro de Calendário", "Não foi possível encontrar uma fonte de calendário para criar um novo calendário para o app.");
        return null;
    }
    
    const newCalendarID = await Calendar.createCalendarAsync({
      title: 'Tarefas (Task Flow)',
      color: '#6750A4',
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: sourceToUse.id,
      source: Platform.OS === 'android' && sourceToUse.isLocalAccount ? sourceToUse : undefined, 
      name: 'taskFlowInternalCalendar',
      ownerAccount: Platform.OS === 'android' ? 'com.taskflow' : undefined, 
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    console.log(`Created new calendar for Task Flow with ID: ${newCalendarID}`);
    return newCalendarID;
  } catch (e) {
    console.error("Failed to find or create a calendar:", e);
    Alert.alert("Erro de Calendário", `Não foi possível encontrar ou criar um calendário: ${e.message || e}`);
    return null;
  }
}