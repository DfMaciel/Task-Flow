package com.example.task_flow.repository;

import com.example.task_flow.entities.Categoria;
import com.example.task_flow.entities.Tarefa;
import com.example.task_flow.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TarefaRepository extends JpaRepository<Tarefa, Long> {
    List<Tarefa> findByUsuario(Usuario usuario);
    List<Tarefa> findByCategoria(Categoria categoria);
}
