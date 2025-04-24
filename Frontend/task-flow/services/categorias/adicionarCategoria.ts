import { CriarCategoria } from "@/types/CategoriasInterface";
import api from "../api";
import { AxiosError } from "axios";

export default async function adicionarCategorias(categoria: CriarCategoria) {
    try {
        const resposta = await api.post("/categorias", categoria);
        
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