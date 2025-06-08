import * as Notifications from 'expo-notifications';

export default async function cancelAllScheduledNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("Todas as notificações agendadas foram canceladas.");
  } catch (error) {
    console.error("Erro ao cancelar todas as notificações:", error);
  }
}