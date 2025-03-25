import api from "../api";
import { AxiosError } from "axios";
import { AdicionarNota } from "@/types/NotasInterface";

export default async function adicionarNota(nota: AdicionarNota, id: number) {
    try {
        const resposta = await api.post(`/notas/${id}`, nota);
        
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