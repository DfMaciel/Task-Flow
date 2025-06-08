import * as Notifications from 'expo-notifications';

export default async function cancelScheduledNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log(`Notificação cancelada: ${notificationId}`);
  } catch (error) {
    console.error(`Erro ao cancelar notificação ${notificationId}:`, error);
  }
}