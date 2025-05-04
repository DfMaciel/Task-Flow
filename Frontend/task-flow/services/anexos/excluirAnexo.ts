import { AxiosError } from "axios";
import api from "../api";

export default async function excluirAnexo(id:number) {
    try {
        const resposta = await api.delete(`/anexos/${id}`);
        
        if (resposta.status === 200) {
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, data: resposta.data };
        }
    } catch (error) {
        let errorMessage = (error as AxiosError).response?.data as any;
        throw new Error(errorMessage);
    }
}