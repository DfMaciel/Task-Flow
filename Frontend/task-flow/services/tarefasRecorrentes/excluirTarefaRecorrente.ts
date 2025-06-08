import AsyncStorage from "@react-native-async-storage/async-storage";
import listarTarefasRecorrentes from "./listarTarefasRecorrentes";

export default async function excluirTarefaRecorrente(id: string): Promise<boolean> {
    try {
        const tarefasRecorrentes = await listarTarefasRecorrentes();
        const tarefasAtualizadas = tarefasRecorrentes.filter(tarefa => tarefa.id !== id);
        await AsyncStorage.setItem('tarefasRecorrentes', JSON.stringify(tarefasAtualizadas));
        return true;
    } catch (error) {
        console.error("Erro ao excluir tarefa recorrente:", error);
        throw error;
    }
}