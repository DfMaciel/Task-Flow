package com.example.task_flow.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
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
    private String status = "Em andamento";

    @Column
    private LocalDateTime dataCriacao;

    @Column
    private LocalDateTime dataInicio;

    @Column
    private LocalDateTime dataConclusao;

    @Column
    private LocalDate prazo;

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
    @JsonIgnoreProperties("tarefas")
    private Usuario usuario;

    public Tarefa() {
    }

    public Long getId() {
        return this.id;
    }

    public String getTitulo() {
        return this.titulo;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public String getStatus() {
        return this.status;
    }

    public LocalDateTime getDataCriacao() {
        return this.dataCriacao;
    }

    public LocalDateTime getDataInicio() {
        return this.dataInicio;
    }

    public LocalDateTime getDataConclusao() {
        return this.dataConclusao;
    }

    public LocalDate getPrazo() {
        return this.prazo;
    }

    public String getPrioridade() {
        return this.prioridade;
    }

    public String getTempoEstimado() {
        return this.tempoEstimado;
    }

    public List<Nota> getNotas() {
        return this.notas;
    }

    public Usuario getUsuario() {
        return this.usuario;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public void setDataInicio(LocalDateTime dataInicio) {
        this.dataInicio = dataInicio;
    }

    public void setDataConclusao(LocalDateTime dataConclusao) {
        this.dataConclusao = dataConclusao;
    }

    public void setPrazo(LocalDate prazo) {
        this.prazo = prazo;
    }

    public void setPrioridade(String prioridade) {
        this.prioridade = prioridade;
    }

    public void setTempoEstimado(String tempoEstimado) {
        this.tempoEstimado = tempoEstimado;
    }

    public void setNotas(List<Nota> notas) {
        this.notas = notas;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof Tarefa)) return false;
        final Tarefa other = (Tarefa) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$id = this.getId();
        final Object other$id = other.getId();
        if (this$id == null ? other$id != null : !this$id.equals(other$id)) return false;
        final Object this$titulo = this.getTitulo();
        final Object other$titulo = other.getTitulo();
        if (this$titulo == null ? other$titulo != null : !this$titulo.equals(other$titulo)) return false;
        final Object this$descricao = this.getDescricao();
        final Object other$descricao = other.getDescricao();
        if (this$descricao == null ? other$descricao != null : !this$descricao.equals(other$descricao)) return false;
        final Object this$status = this.getStatus();
        final Object other$status = other.getStatus();
        if (this$status == null ? other$status != null : !this$status.equals(other$status)) return false;
        final Object this$dataCriacao = this.getDataCriacao();
        final Object other$dataCriacao = other.getDataCriacao();
        if (this$dataCriacao == null ? other$dataCriacao != null : !this$dataCriacao.equals(other$dataCriacao))
            return false;
        final Object this$dataInicio = this.getDataInicio();
        final Object other$dataInicio = other.getDataInicio();
        if (this$dataInicio == null ? other$dataInicio != null : !this$dataInicio.equals(other$dataInicio))
            return false;
        final Object this$dataConclusao = this.getDataConclusao();
        final Object other$dataConclusao = other.getDataConclusao();
        if (this$dataConclusao == null ? other$dataConclusao != null : !this$dataConclusao.equals(other$dataConclusao))
            return false;
        final Object this$prazo = this.getPrazo();
        final Object other$prazo = other.getPrazo();
        if (this$prazo == null ? other$prazo != null : !this$prazo.equals(other$prazo)) return false;
        final Object this$prioridade = this.getPrioridade();
        final Object other$prioridade = other.getPrioridade();
        if (this$prioridade == null ? other$prioridade != null : !this$prioridade.equals(other$prioridade))
            return false;
        final Object this$tempoEstimado = this.getTempoEstimado();
        final Object other$tempoEstimado = other.getTempoEstimado();
        if (this$tempoEstimado == null ? other$tempoEstimado != null : !this$tempoEstimado.equals(other$tempoEstimado))
            return false;
        final Object this$notas = this.getNotas();
        final Object other$notas = other.getNotas();
        if (this$notas == null ? other$notas != null : !this$notas.equals(other$notas)) return false;
        final Object this$usuario = this.getUsuario();
        final Object other$usuario = other.getUsuario();
        if (this$usuario == null ? other$usuario != null : !this$usuario.equals(other$usuario)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof Tarefa;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $id = this.getId();
        result = result * PRIME + ($id == null ? 43 : $id.hashCode());
        final Object $titulo = this.getTitulo();
        result = result * PRIME + ($titulo == null ? 43 : $titulo.hashCode());
        final Object $descricao = this.getDescricao();
        result = result * PRIME + ($descricao == null ? 43 : $descricao.hashCode());
        final Object $status = this.getStatus();
        result = result * PRIME + ($status == null ? 43 : $status.hashCode());
        final Object $dataCriacao = this.getDataCriacao();
        result = result * PRIME + ($dataCriacao == null ? 43 : $dataCriacao.hashCode());
        final Object $dataInicio = this.getDataInicio();
        result = result * PRIME + ($dataInicio == null ? 43 : $dataInicio.hashCode());
        final Object $dataConclusao = this.getDataConclusao();
        result = result * PRIME + ($dataConclusao == null ? 43 : $dataConclusao.hashCode());
        final Object $prazo = this.getPrazo();
        result = result * PRIME + ($prazo == null ? 43 : $prazo.hashCode());
        final Object $prioridade = this.getPrioridade();
        result = result * PRIME + ($prioridade == null ? 43 : $prioridade.hashCode());
        final Object $tempoEstimado = this.getTempoEstimado();
        result = result * PRIME + ($tempoEstimado == null ? 43 : $tempoEstimado.hashCode());
        final Object $notas = this.getNotas();
        result = result * PRIME + ($notas == null ? 43 : $notas.hashCode());
        final Object $usuario = this.getUsuario();
        result = result * PRIME + ($usuario == null ? 43 : $usuario.hashCode());
        return result;
    }

    public String toString() {
        return "Tarefa(id=" + this.getId() + ", titulo=" + this.getTitulo() + ", descricao=" + this.getDescricao() + ", status=" + this.getStatus() + ", dataCriacao=" + this.getDataCriacao() + ", dataInicio=" + this.getDataInicio() + ", dataConclusao=" + this.getDataConclusao() + ", prazo=" + this.getPrazo() + ", prioridade=" + this.getPrioridade() + ", tempoEstimado=" + this.getTempoEstimado() + ", notas=" + this.getNotas() + ", usuarioId=" + (this.getUsuario() != null ? this.usuario.getId().toString() : null) + ")";
    }
}