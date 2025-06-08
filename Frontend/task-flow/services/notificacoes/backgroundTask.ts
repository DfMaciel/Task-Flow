import * as TaskManager from 'expo-task-manager'
import * as BackgroundFetch from 'expo-background-fetch'
import * as Notifications from 'expo-notifications'
import ListarTarefas from '../tarefas/listarTarefasService';
import { VisualizarTarefa } from '@/types/TarefaInteface';

TaskManager.defineTask('verificar-tarefas-vencidas', async () => {
    try {
        console.log('Iniciando verificação de tarefas vencidas...');
        const resultadoTarefas = await ListarTarefas();

        if (resultadoTarefas.status !== 200) {
            console.error('Erro ao buscar tarefas:', resultadoTarefas.status);
            return BackgroundFetch.BackgroundFetchResult.Failed;
        }
        
        const tarefas = resultadoTarefas.data;
        const agora = new Date();

        tarefas.forEach((tarefa: VisualizarTarefa) => {
            if (tarefa.status !== 'concluida') {
                return;
            }
            if (tarefa.prazo) {
                let dataVencimento = new Date(tarefa.prazo);
                let vencida = dataVencimento < agora;
                let proximoVencer = new Date(dataVencimento.getTime() - 24 * 60 * 60 * 1000);

                console.log(`Verificando tarefa: ${tarefa.titulo}`);
                console.log(`Data de vencimento: ${dataVencimento.toLocaleDateString()}`);
                console.log(`Vencida: ${vencida}`);
                console.log(`Próximo vencimento: ${proximoVencer.toLocaleDateString()}`);

                if (vencida) {
                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: 'Tarefa Vencida',
                            body: `A tarefa "${tarefa.titulo}" está vencida desde ${dataVencimento.toLocaleDateString()}.`,
                            sound: 'default',
                        },
                        trigger: null,
                    })
                }

                if (proximoVencer > agora && proximoVencer < new Date(agora.getTime() + 24 * 60 * 60 * 1000)) {
                    Notifications.scheduleNotificationAsync({
                        content: {
                            title: 'Tarefa Próxima do Vencimento',
                            body: `A tarefa "${tarefa.titulo}" está próxima do vencimento.`,
                            sound: 'default',
                        },
                        trigger: null,
                    });
                }

            } else {
                return
            }
        })
        
        return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
        console.error('Erro ao verificar tarefas vencidas:', error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});