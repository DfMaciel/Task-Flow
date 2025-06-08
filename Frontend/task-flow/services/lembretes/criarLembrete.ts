import { CriarLembrete, Lembrete } from "@/types/LembreteInterface";
import listarLembretes from "./listarLembretes";
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import scheduleNotification from "@/services/notificacoes/scheduleReminder";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function criarLembrete(lembrete: CriarLembrete): Promise<Lembrete | null> {
    try {
        const lembretes = await listarLembretes();
        const novoLembrete: Lembrete = {
            ...lembrete,
            id: uuidv4(),
            notificationIds: [],
        }

        const notificationContent = {
            title: novoLembrete.titulo,
            body: `Lembrete: ${novoLembrete.titulo}`,
        };

        const notificationOptions = {
            date: new Date(novoLembrete.dataHora),
            repeats: novoLembrete.frequencia !== 'nenhuma',
            frequency: novoLembrete.frequencia,
            daysOfWeek: novoLembrete.diasSemana,
            dayOfMonth: novoLembrete.diaMes,
        };

        const scheduledIds = await scheduleNotification(notificationContent, notificationOptions);
        
        if (scheduledIds && scheduledIds.length > 0) {
            novoLembrete.notificationIds = scheduledIds;
        } else if (novoLembrete.frequencia !== 'nenhuma') {
            console.warn("Falha ao agendar notificações para lembrete recorrente, não salvando.");
            return null; 
        } else if (!scheduledIds && novoLembrete.frequencia === 'nenhuma') {
            console.warn("Falha ao agendar notificação para lembrete único, não salvando.");
            return null;
        }
        
        const lembretesAtualizados = [...lembretes, novoLembrete];
        await AsyncStorage.setItem('lembretes', JSON.stringify(lembretesAtualizados));
        return novoLembrete;
    } catch (error) {
        console.error("Erro ao criar lembrete:", error);
        return null;
    }
};
