import { AxiosError } from "axios";
import api from "../api";

export default async function excluirCategoria(id: number) {
    try {
        const resposta = await api.delete(`/categorias/${id}`);
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