package com.example.task_flow.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "tarefas")
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tarefa_id")
    private Long id;

    @Column
    private String titulo;

    @Column
    private String descricao;

    @Column
    private String status;

    @Column
    private String dataCriacao;

    @Column
    private String dataConclusao;

    @Column
    private String prazo;

    @Column
    private String prioridade;

    @Column
    private String tempoEstimado;

    @OneToMany(mappedBy = "tarefa")
    private List<Nota> notas;

//    @OneToMany(mappedBy = "tarefa")
//    private List<Anexo> anexos;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
}
