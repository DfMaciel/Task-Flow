import { AxiosError } from "axios";
import api from "../api";

export default async function desvincularCategoriaTarefa(id: number) {
    try {
        const resposta = await api.patch(`/tarefas/${id}/categoria/desvincular`);
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