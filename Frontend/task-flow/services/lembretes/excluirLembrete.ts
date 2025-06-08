import AsyncStorage from "@react-native-async-storage/async-storage";
import listarLembretes from "./listarLembretes";
import cancelScheduledNotification from "@/services/notificacoes/cancelReminder";

export default async function excluirLembrete(id: string): Promise<boolean> {
    try {
        const lembretes = await listarLembretes();
        const lembrete = lembretes.find(l => l.id === id);
    
        if (lembrete?.notificationIds) {
            for (const notificationId of lembrete.notificationIds) {
                await cancelScheduledNotification(notificationId);
            }
        }

        const updatedReminders = lembretes.filter(template => template.id !== id);
        await AsyncStorage.setItem("lembretes", JSON.stringify(updatedReminders));
        return true;
    } catch (error) {
        console.error("Erro ao excluir lembrete:", error);
        return false;
    }
}
