package com.example.task_flow.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "notas")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nota_id")
    private Long id;

    @Column
    private String conteudo;

    @Column
    private String dataCriacao;

    @ManyToOne
    @JoinColumn(name = "tarefa_id")
    private Tarefa tarefa;

}
