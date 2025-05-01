import { AxiosError } from "axios";
import api from "../api";

export default async function atualizarUsuario(usuarioAtualizado: Record<string, any>) {
    try {
        console.log("atualizar usuario", usuarioAtualizado);
        const resposta = await api.put(`/usuarios `, usuarioAtualizado);
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