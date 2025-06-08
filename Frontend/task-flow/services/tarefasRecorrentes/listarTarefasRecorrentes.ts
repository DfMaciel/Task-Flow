import { TarefaRecorrente } from "@/types/TarefaInteface";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function listarTarefasRecorrentes(): Promise<TarefaRecorrente[]> {
    try {
        const tarefasRecorrentes = await AsyncStorage.getItem('tarefasRecorrentes');
        if (tarefasRecorrentes) {
            return JSON.parse(tarefasRecorrentes) as TarefaRecorrente[];
        }
        return [];
    } catch (error) {
        console.error("Erro ao listar tarefas recorrentes:", error);
        throw error;
    }
}