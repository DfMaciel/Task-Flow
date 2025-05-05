package com.example.task_flow.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notas")
public class Nota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nota_id")
    private Long id;

    @Column
    private String conteudo;

    @Column
    private LocalDateTime dataCriacao;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "tarefa_id")
    private Tarefa tarefa;

    public Nota() {
    }

    public Long getId() {
        return this.id;
    }

    public String getConteudo() {
        return this.conteudo;
    }

    public LocalDateTime getDataCriacao() {
        return this.dataCriacao;
    }

    public Tarefa getTarefa() {
        return this.tarefa;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    @JsonIgnore
    public void setTarefa(Tarefa tarefa) {
        this.tarefa = tarefa;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof Nota)) return false;
        final Nota other = (Nota) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$id = this.getId();
        final Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final Object this$conteudo = this.getConteudo();
        final Object other$conteudo = other.getConteudo();
        if (this$conteudo == null ? other$conteudo != null : !this$conteudo.equals(other$conteudo)) return false;
        final Object this$dataCriacao = this.getDataCriacao();
        final Object other$dataCriacao = other.getDataCriacao();
        if (this$dataCriacao == null ? other$dataCriacao != null : !this$dataCriacao.equals(other$dataCriacao))
            return false;
        final Object this$tarefa = this.getTarefa();
        final Object other$tarefa = other.getTarefa();
        if (this$tarefa == null ? other$tarefa != null : !this$tarefa.equals(other$tarefa)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof Nota;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final Object $conteudo = this.getConteudo();
        result = result * PRIME + ($conteudo == null ? 43 : $conteudo.hashCode());
        final Object $dataCriacao = this.getDataCriacao();
        result = result * PRIME + ($dataCriacao == null ? 43 : $dataCriacao.hashCode());
        final Object $tarefa = this.getTarefa();
        result = result * PRIME + ($tarefa == null ? 43 : $tarefa.hashCode());
        return result;
    }

    public String toString() {
        return "Nota(id=" + this.getId() + ", conteudo=" + this.getConteudo() + ", dataCriacao=" + this.getDataCriacao() + ")";
    }
}