package com.example.task_flow.repository;

import com.example.task_flow.entities.Anexo;
import com.example.task_flow.entities.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnexoRepository extends JpaRepository<Anexo, Long> {
    List<Anexo> findByTarefa(Tarefa tarefa);
}
