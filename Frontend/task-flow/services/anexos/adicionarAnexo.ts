import { AxiosError } from "axios";
import api from "../api";

export default async function adicionarAnexo(id: number, uri: string, name: string, tipo: string) {
    const formData = new FormData();
    formData.append("file", {
        uri,
        name,
        type: tipo,
    } as any);
    
    try {
        const resposta = await api.post(`/tarefas/anexo/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
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