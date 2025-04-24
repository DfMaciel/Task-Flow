export interface VisualizarCategoria {
    id: number;
    nome: string;
    usuario?: {
        id: number;
        nome: string;
    }
}

export interface CriarCategoria {
    nome: string;
}