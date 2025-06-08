import { TarefaRecorrente } from "@/types/TarefaInteface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';
import listarTarefasRecorrentes from "./listarTarefasRecorrentes";

export default async function salvarTarefaRecorrente(tarefa: Omit<TarefaRecorrente, 'id'>): 
    Promise<TarefaRecorrente> {
    try {
        const tarefasRecorrentes = await listarTarefasRecorrentes();
        const novaTarefaRecorrente: TarefaRecorrente = { ...tarefa, id: uuidv4() };
        const tarefasAtualizadas = [...tarefasRecorrentes, novaTarefaRecorrente];
        await AsyncStorage.setItem('tarefasRecorrentes', JSON.stringify(tarefasAtualizadas));
        return novaTarefaRecorrente;
    } catch (error) { 
        console.error("Erro ao salvar tarefa recorrente:", error);
        throw error;
    }
};