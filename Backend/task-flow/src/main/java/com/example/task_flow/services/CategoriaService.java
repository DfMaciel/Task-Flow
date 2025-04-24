package com.example.task_flow.services;

import com.example.task_flow.controllers.Dto.AtualizarTarefaDto;
import com.example.task_flow.controllers.Dto.CadastroCategoriaDto;
import com.example.task_flow.entities.Categoria;
import com.example.task_flow.entities.Tarefa;
import com.example.task_flow.entities.Usuario;
import com.example.task_flow.repository.CategoriaRepository;
import com.example.task_flow.repository.TarefaRepository;
import com.example.task_flow.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private TarefaRepository tarefaRepository;

    public List<Categoria> listarCategorias (Usuario usuario) {
        List<Categoria> categorias = categoriaRepository.findByUsuario(usuario);
        return categorias;
    }

    public Categoria buscarCategoria(Long id) throws Exception {
        Optional<Categoria> categoria = categoriaRepository.findById(id);
        if (categoria.isEmpty()) {
            throw new Exception("Categoria não encontrada");
        }
        return categoria.get();
    }

    public Long cadastrarCategoria(Usuario usuario, CadastroCategoriaDto categoriaDto) throws Exception {
        Categoria categoria = new Categoria();
        categoria.setNome(categoriaDto.nome());
        categoria.setUsuario(usuario);
        Categoria categoriaSalva = categoriaRepository.save(categoria);
        usuario.getCategorias().add(categoriaSalva);
        usuarioRepository.save(usuario);
        return categoriaSalva.getId();
    }

    public void atualizarCategoria(Categoria categoria, CadastroCategoriaDto categoriaDto) {
        categoria.setNome(categoriaDto.nome());
        categoriaRepository.save(categoria);
    }

    public void deletarCategoria(Long id) throws Exception {
        Optional<Categoria> categoriaOpcional = categoriaRepository.findById(id);
        if (categoriaOpcional.isEmpty()) {
            throw new Exception("Categoria não encontrada");
        }
        Categoria categoria = categoriaOpcional.get();
        List<Tarefa> tarefas = tarefaRepository.findByCategoria(categoria);
        for (Tarefa tarefa : tarefas) {
            tarefa.setCategoria(null);
            tarefaRepository.save(tarefa);
        }
        categoriaRepository.delete(categoria);
    }
}
