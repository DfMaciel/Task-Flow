import { VisualizarCategoria } from "./CategoriasInterface";
import { VisualizarTarefa } from "./TarefaInteface";

export interface UsuarioCadastroInterface {
  nome: string;
  email: string;   
  senha: string;
}

export interface VisualizarUsuarioInterface {
  id: number;
  nome: string;
  email: string;
  senha: string;
  tarefas: VisualizarTarefa[];
  categorias: VisualizarCategoria[];
}