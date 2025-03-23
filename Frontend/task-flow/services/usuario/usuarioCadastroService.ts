import { AxiosError } from 'axios';
import { UsuarioCadastroInterface } from '../../types/UsuarioInterface';
import api from '../api';

export default async function usuarioCadastroService(usuarioCadastro: UsuarioCadastroInterface) {
    try {
        const resposta = await api.post('/usuarios', usuarioCadastro);

        if (resposta.status == 201) {
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, data: resposta.data };
        }
    } catch (error) {
        let errorMessage = (error as AxiosError).response?.data as any;
        throw new Error(errorMessage);
    }
}