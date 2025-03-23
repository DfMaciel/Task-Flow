import { AxiosError } from "axios";
import api from "../api";

export default async function ListarTarefas() {
    try {
        const resposta = await api.get('/tarefas');

        if (resposta.status === 200) {
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, data: resposta.data };
        }
    } catch (error) {
        let errorMessage = (error as AxiosError).response?.data as any
        throw new Error(errorMessage);
    }
}