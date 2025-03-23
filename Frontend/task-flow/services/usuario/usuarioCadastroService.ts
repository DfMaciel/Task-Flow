import { UsuarioCadastroInterface } from '../../types/UsuarioInterface';
import api from '../api';

export default async function usuarioCadastroService(usuarioCadastro: UsuarioCadastroInterface) {
    try {
        const resposta = await api.post('/usuarios', usuarioCadastro);
        return resposta.data;
    } catch (error:any) {
        return error.response.data;
    }
}