package com.example.task_flow.repository;

import com.example.task_flow.entities.Categoria;
import com.example.task_flow.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    Categoria findByNome(String nome);
    List<Categoria> findByUsuario(Usuario usuario);
}
