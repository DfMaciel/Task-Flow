import { AxiosError } from "axios";
import api from "../api";
import { AtualizarTarefa } from "@/types/TarefaInteface";

export default async function atualizarTarefa(id: number, tarefaAtualizada: Record<string, any>) {
    try {
        console.log("atualizarTarefa", tarefaAtualizada);
        const resposta = await api.put(`/tarefas/${id}`, { 
            tarefaAtualizada
         });
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