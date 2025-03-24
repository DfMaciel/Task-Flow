import { CriarTarefa } from "@/types/TarefaInteface"; 
import api from "../api";
import { AxiosError } from "axios";

export default async function adicionarTarefas(tarefa: CriarTarefa) {
    try {
        const resposta = await api.post("/tarefas", tarefa);
        
        if (resposta.status === 201) {
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, data: resposta.data };
        }
    } catch (error) {
        let errorMessage = (error as AxiosError).response?.data as any;
        throw new Error(errorMessage);
    }
}