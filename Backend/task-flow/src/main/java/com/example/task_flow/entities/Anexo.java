package com.example.task_flow.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "anexos")
public class Anexo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "anexo_id")
    private Long id;

    @Column
    private String nome;

    @Column
    private String caminho;

    @Column
    private String tipo;

    @Column
    private Long tamanho;

    @ManyToOne
    @JoinColumn(name = "tarefa_id")
    @JsonIgnoreProperties({"anexos", "notas", "usuario", "categoria"})
    private Tarefa tarefa;

    public Anexo() {
    }

    public Long getId() {
        return this.id;
    }

    public String getNome() {
        return this.nome;
    }

    public String getCaminho() {
        return this.caminho;
    }

    public String getTipo() {
        return this.tipo;
    }

    public Long getTamanho() {
        return this.tamanho;
    }

    public Tarefa getTarefa() {
        return this.tarefa;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setCaminho(String caminho) {
        this.caminho = caminho;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public void setTamanho(Long tamanho) {
        this.tamanho = tamanho;
    }

    public void setTarefa(Tarefa tarefa) {
        this.tarefa = tarefa;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof Anexo)) return false;
        final Anexo other = (Anexo) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$id = this.getId();
        final Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final Object this$nome = this.getNome();
        final Object other$nome = other.getNome();
        if (this$nome == null ? other$nome != null : !this$nome.equals(other$nome)) return false;
        final Object this$caminho = this.getCaminho();
        final Object other$caminho = other.getCaminho();
        if (this$caminho == null ? other$caminho != null : !this$caminho.equals(other$caminho)) return false;
        final Object this$tipo = this.getTipo();
        final Object other$tipo = other.getTipo();
        if (this$tipo == null ? other$tipo != null : !this$tipo.equals(other$tipo)) return false;
        final Object this$tamanho = this.getTamanho();
        final Object other$tamanho = other.getTamanho();
        if (this$tamanho == null ? other$tamanho != null : !this$tamanho.equals(other$tamanho)) return false;
        final Object this$tarefa = this.getTarefa();
        final Object other$tarefa = other.getTarefa();
        if (this$tarefa == null ? other$tarefa != null : !this$tarefa.equals(other$tarefa)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof Anexo;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final Object $nome = this.getNome();
        result = result * PRIME + ($nome == null ? 43 : $nome.hashCode());
        final Object $caminho = this.getCaminho();
        result = result * PRIME + ($caminho == null ? 43 : $caminho.hashCode());
        final Object $tipo = this.getTipo();
        result = result * PRIME + ($tipo == null ? 43 : $tipo.hashCode());
        final Object $tamanho = this.getTamanho();
        result = result * PRIME + ($tamanho == null ? 43 : $tamanho.hashCode());
        final Object $tarefa = this.getTarefa();
        result = result * PRIME + ($tarefa == null ? 43 : $tarefa.hashCode());
        return result;
    }

    public String toString() {
        return "Anexos(id=" + this.getId() + ", nome=" + this.getNome() + ", caminho=" + this.getCaminho() + ", tipo=" + this.getTipo() + ", tamanho=" + this.getTamanho() + ", tarefa=" + this.getTarefa() + ")";
    }
}
