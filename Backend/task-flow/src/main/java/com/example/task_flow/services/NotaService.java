package com.example.task_flow.services;

import com.example.task_flow.entities.Nota;
import com.example.task_flow.entities.Tarefa;
import com.example.task_flow.repository.NotaRepository;
import com.example.task_flow.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NotaService {

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private TarefaService tarefaService;

    public List<Nota> listarNotas(Long idTarefa) throws Exception {
        Optional<Tarefa> tarefaOptional = tarefaRepository.findById(idTarefa);
        if (tarefaOptional.isEmpty()) {
            throw new Exception("Tarefa não encontrada");
        }
        Tarefa tarefa = tarefaOptional.get();
        return tarefa.getNotas();
    }

    public Nota buscarNota(Long idNota) throws Exception {
        Optional<Nota> notaOptional = notaRepository.findById(idNota);
        if (notaOptional.isEmpty()) {
            throw new Exception("Nota não encontrada");
        }
        return notaOptional.get();
    }

    public Long cadastrarNota(Tarefa tarefa, String conteudo) throws Exception {
        Nota nota = new Nota();
        nota.setConteudo(conteudo);
        LocalDateTime dataAtual = LocalDateTime.now();
        nota.setDataCriacao(dataAtual);
        nota.setTarefa(tarefa);
        Nota notaSalva = notaRepository.save(nota);
        tarefa.getNotas().add(notaSalva);
        tarefaRepository.save(tarefa);
        return notaSalva.getId();
    }

    public void atualizarNota(Long idNota, String conteudo) throws Exception {
        Optional<Nota> notaOptional = notaRepository.findById(idNota);
        if (notaOptional.isEmpty()) {
            throw new Exception("Nota não encontrada");
        }
        Nota nota = notaOptional.get();
        nota.setConteudo(conteudo);
        notaRepository.save(nota);
    }

    public void deletarNota(Long idNota) throws Exception {
        Optional<Nota> notaOptional = notaRepository.findById(idNota);
        if (notaOptional.isEmpty()) {
            throw new Exception("Nota não encontrada");
        }
        Nota nota = notaOptional.get();
        notaRepository.delete(nota);
    }
}
