package com.example.task_flow.services;

import com.example.task_flow.controllers.Dto.AtualizarTarefaDto;
import com.example.task_flow.controllers.Dto.CadastroTarefaDto;
import com.example.task_flow.entities.Tarefa;
import com.example.task_flow.entities.Usuario;
import com.example.task_flow.repository.TarefaRepository;
import com.example.task_flow.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TarefaService {

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Tarefa> listarTarefas(Usuario usuario) {
        List<Tarefa> tarefas = tarefaRepository.findByUsuario(usuario);
        return tarefas;
    }

    public Tarefa buscarTarefa(Long id) throws Exception {
        Optional<Tarefa> tarefa = tarefaRepository.findById(id);
        if (tarefa.isEmpty()) {
            throw new Exception("Tarefa não encontrada");
        }
        return tarefa.get();
    }

    public Long cadastrarTarefa(Usuario usuario, @RequestBody CadastroTarefaDto cadastroTarefaDto) {
        System.out.println("TarefaDto" + cadastroTarefaDto);
        Tarefa tarefa = new Tarefa();
        tarefa.setUsuario(usuario);
        tarefa.setTitulo(cadastroTarefaDto.titulo());
        tarefa.setDescricao(cadastroTarefaDto.descricao());
        tarefa.setPrioridade(cadastroTarefaDto.prioridade());
        cadastroTarefaDto.tempoEstimado().ifPresent(tarefa::setTempoEstimado);
        cadastroTarefaDto.prazo().ifPresent(tarefa::setPrazo);
        LocalDateTime dataAtual = LocalDateTime.now();
        tarefa.setDataCriacao(dataAtual);
        System.out.println("Tarefa" + tarefa);
        Tarefa tarefaSalva = tarefaRepository.save(tarefa);
        return tarefaSalva.getId();
    }

    public void atualizarTarefa(Tarefa tarefa, AtualizarTarefaDto atualizarTarefaDto) {
        if (atualizarTarefaDto.titulo().isPresent()) {
            tarefa.setTitulo(atualizarTarefaDto.titulo().get());
        }
        if (atualizarTarefaDto.descricao().isPresent()) {
            tarefa.setDescricao(atualizarTarefaDto.descricao().get());
        }
        if (atualizarTarefaDto.status().isPresent()) {
            tarefa.setStatus(atualizarTarefaDto.status().get());
        }
        if (atualizarTarefaDto.prioridade().isPresent()) {
            tarefa.setPrioridade(atualizarTarefaDto.prioridade().get());
        }
        if (atualizarTarefaDto.tempoEstimado().isPresent()) {
            tarefa.setTempoEstimado(atualizarTarefaDto.tempoEstimado().get());
        }
        if (atualizarTarefaDto.prazo().isPresent()) {
            tarefa.setPrazo(atualizarTarefaDto.prazo().get());
        }
        if (atualizarTarefaDto.dataInicio().isPresent()) {
            tarefa.setDataInicio(atualizarTarefaDto.dataInicio().get());
        }
        if (atualizarTarefaDto.dataConclusao().isPresent()) {
            tarefa.setDataConclusao(atualizarTarefaDto.dataConclusao().get());
        }
        tarefaRepository.save(tarefa);
    }

    public void deletarTarefa(Long id) {
        tarefaRepository.deleteById(id);
    }
}
