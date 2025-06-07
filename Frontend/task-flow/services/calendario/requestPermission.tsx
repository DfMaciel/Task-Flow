import * as Calendar from 'expo-calendar';

export default async function requestCalendarPermissions() {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status === 'granted') {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    console.log('Calendar permission granted. Available calendars:', calendars);
    return true;
  } else {
    console.warn('Calendar permission denied');
    alert('Para adicionar tarefas ao calendário, por favor, conceda a permissão de acesso ao calendário nas configurações do seu dispositivo.');
    return false;
  }
}