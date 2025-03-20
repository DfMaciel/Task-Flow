package com.example.task_flow.repository;

import com.example.task_flow.entities.Tarefa;
import com.example.task_flow.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TarefaRepository extends JpaRepository<Tarefa, Long> {
    Optional<Tarefa> findByUsuario(Usuario usuario);
}
