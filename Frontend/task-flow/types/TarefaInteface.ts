import { VisualizarNota } from "./NotasInterface";

export interface VisualizarTarefa {
    id: number;
    titulo: string;
    descricao: string;
    status?: string;
    dataCriacao: string;
    dataInicio?: string;
    dataConclusao?: string;
    prazo: string;
    prioridade: string;
    tempoEstimado?: string;
    notas: VisualizarNota[];
}

export interface CriarTarefa {
    titulo: string;
    descricao: string;
    prioridade: string;
    tempoEstimado?: number | null;
    dataEntrega?: string;
}