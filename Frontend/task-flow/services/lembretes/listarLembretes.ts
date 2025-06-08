import { Lembrete } from "@/types/LembreteInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function listarLembretes(): Promise<Lembrete[]> {
    try {
        const lembretes = await AsyncStorage.getItem('lembretes');
        if (lembretes) {
            return JSON.parse(lembretes) as Lembrete[];
        }
        return [];
    } catch (error) {
        console.error("Erro ao listar lembretes:", error);
        return [];
    }
}