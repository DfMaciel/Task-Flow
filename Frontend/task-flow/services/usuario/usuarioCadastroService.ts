import axios, { AxiosError } from 'axios';
import { UsuarioCadastroInterface } from '../../types/UsuarioInterface';
import Constants from 'expo-constants';

const { SERVER_ROUTE } = Constants.expoConfig?.extra || {};

export default async function usuarioCadastroService(usuarioCadastro: UsuarioCadastroInterface) {
    try {
        console.log(`Tentando conectar a: ${SERVER_ROUTE}/usuarios`);
        const resposta = await axios.post(`${SERVER_ROUTE}/usuarios`, usuarioCadastro);
        console.log(resposta);

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