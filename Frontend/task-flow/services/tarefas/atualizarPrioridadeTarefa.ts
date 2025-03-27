import { AxiosError } from "axios";
import api from "../api";

export default async function atualizarPrioridadeTarefa(id: number, prioridade: string) {
    try {
        const resposta = await api.patch(`/tarefas/${id}/prioridade`, { prioridade });
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