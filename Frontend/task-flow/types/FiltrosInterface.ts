import { VisualizarCategoria } from "./CategoriasInterface";

export interface FiltrosOptions {
    prioridade: string | null;
    status: string | null;
    prazo: string | null;
    categoria: VisualizarCategoria | null;
    dataPersonalizada?: string | null; 
}