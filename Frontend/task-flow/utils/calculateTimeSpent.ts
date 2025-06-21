import { VisualizarTarefa } from "@/types/TarefaInteface";

export interface TimeSpentInfo {
    hoursSpent: number | null;
    isOverEstimate: boolean;
    displayText: string | null;
}

export function calculateTimeSpent(tarefa: VisualizarTarefa | undefined): TimeSpentInfo {
    if (!tarefa || !tarefa.dataInicio) {
        return { hoursSpent: null, isOverEstimate: false, displayText: "N/A" };
    }

    const dataInicio = new Date(tarefa.dataInicio);
    const dataFim = tarefa.dataConclusao ? new Date(tarefa.dataConclusao) : new Date();

    if (isNaN(dataInicio.getTime())) {
        return { hoursSpent: null, isOverEstimate: false, displayText: "Data de início inválida" };
    }

    const diffMs = dataFim.getTime() - dataInicio.getTime();

    if (diffMs < 0) {
        return { hoursSpent: 0, isOverEstimate: false, displayText: "0.0 horas" };
    }

    const hoursSpent = diffMs / (1000 * 60 * 60);
    let isOverEstimate = false;
    
    if (tarefa.tempoEstimado) {
        const tempoEstimadoNum = parseFloat(tarefa.tempoEstimado);
        if (!isNaN(tempoEstimadoNum) && tempoEstimadoNum > 0) {
            isOverEstimate = hoursSpent > tempoEstimadoNum;
        }
    }

    return {
        hoursSpent: hoursSpent,
        isOverEstimate: isOverEstimate,
        displayText: `${hoursSpent.toFixed(1)} horas`
    };
}