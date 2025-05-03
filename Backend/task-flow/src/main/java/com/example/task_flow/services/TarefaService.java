package com.example.task_flow.services;

import com.example.task_flow.controllers.Dto.AtualizarTarefaDto;
import com.example.task_flow.controllers.Dto.CadastroTarefaDto;
import com.example.task_flow.entities.Anexo;
import com.example.task_flow.entities.Categoria;
import com.example.task_flow.entities.Tarefa;
import com.example.task_flow.entities.Usuario;
import com.example.task_flow.repository.CategoriaRepository;
import com.example.task_flow.repository.TarefaRepository;
import com.example.task_flow.repository.UsuarioRepository;
import com.example.task_flow.utils.VerificadorData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TarefaService {

    @Autowired
    private TarefaRepository tarefaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private AnexoService anexoService;

    @Autowired
    private VerificadorData verificadorData;

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
        if (cadastroTarefaDto.idCategoria().isPresent()) {
            Optional<Categoria> categoriaOptional = categoriaRepository.findById(cadastroTarefaDto.idCategoria().get());
            if (categoriaOptional.isEmpty()) {
                throw new IllegalArgumentException("Categoria não encontrada");
            }
            Categoria categoria = categoriaOptional.get();
            if (!usuario.equals(categoria.getUsuario())) {
                throw new IllegalArgumentException("Usuário não tem permissão para cadastrar a tarefa nesta categoria");
            }
            tarefa.setCategoria(categoria);
        }
        cadastroTarefaDto.tempoEstimado().ifPresent(tarefa::setTempoEstimado);
        cadastroTarefaDto.prazo().ifPresent(tarefa::setPrazo);
        LocalDateTime dataAtual = LocalDateTime.now();
        tarefa.setDataCriacao(dataAtual);
        System.out.println("Tarefa" + tarefa);
        Tarefa tarefaSalva = tarefaRepository.save(tarefa);
        return tarefaSalva.getId();
    }

    public void adicionarAnexoTarefa(Tarefa tarefa, MultipartFile anexo) {
        try {
            Anexo anexoSalvo = anexoService.salvarAnexo(anexo, tarefa, tarefa.getUsuario().getId());
            tarefa.getAnexos().add(anexoSalvo);
            tarefaRepository.save(tarefa);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar o anexo: " + e.getMessage());
        }
    }

    public void atualizarTarefa(Tarefa tarefa, AtualizarTarefaDto atualizarTarefaDto) {
        if (atualizarTarefaDto.titulo().isPresent()) {
            tarefa.setTitulo(atualizarTarefaDto.titulo().get());
        }
        if (atualizarTarefaDto.descricao().isPresent()) {
            tarefa.setDescricao(atualizarTarefaDto.descricao().get());
        }
        if (atualizarTarefaDto.tempoEstimado().isPresent()) {
            tarefa.setTempoEstimado(atualizarTarefaDto.tempoEstimado().get());
        }
        if (atualizarTarefaDto.prazo().isPresent()) {
            tarefa.setPrazo(atualizarTarefaDto.prazo().get());
        }
        if (atualizarTarefaDto.dataInicio().isPresent()) {
            if (!verificadorData.verificarDataConclusao(atualizarTarefaDto.dataInicio().get(), atualizarTarefaDto.dataConclusao().orElse(null))) {
                throw new IllegalArgumentException("A data de conclusão deve ser posterior à data de início.");
            }
            tarefa.setDataInicio(atualizarTarefaDto.dataInicio().get());
        }
        if (atualizarTarefaDto.dataConclusao().isPresent()) {
            if (!verificadorData.verificarDataConclusao(tarefa.getDataInicio(), atualizarTarefaDto.dataConclusao().get())) {
                throw new IllegalArgumentException("A data de conclusão deve ser posterior à data de início.");
            }
            tarefa.setDataConclusao(atualizarTarefaDto.dataConclusao().get());
        }
        tarefaRepository.save(tarefa);
    }

    public void atualizarStatusTarefa(Tarefa tarefa, String status) {
        tarefa.setStatus(status);
        switch (status) {
            case "naoiniciada":
                tarefa.setDataInicio(null);
                tarefa.setDataConclusao(null);
                break;
            case "emandamento":
                tarefa.setDataInicio(LocalDateTime.now());
                tarefa.setDataConclusao(null);
                break;
            case "concluida":
                if (tarefa.getDataInicio() == null) {
                    tarefa.setDataInicio(LocalDateTime.now());
                }
                tarefa.setDataConclusao(LocalDateTime.now());
                break;
        }

        tarefaRepository.save(tarefa);
    }

    public void atualizarPrioridadeTarefa(Tarefa tarefa, String prioridade) {
        tarefa.setPrioridade(prioridade);
        tarefaRepository.save(tarefa);
    }

    public void atualizarCategoriaTarefa(Tarefa tarefa, Long idCategoria) {
        Optional<Categoria> categoriaOptional = categoriaRepository.findById(idCategoria);
        if (categoriaOptional.isEmpty()) {
            throw new IllegalArgumentException("Categoria não encontrada");
        }
        Categoria categoria = categoriaOptional.get();

        if (!tarefa.getUsuario().equals(categoria.getUsuario())) {
            throw new IllegalArgumentException("Usuário não tem permissão para atualizar a categoria da tarefa");
        }

        tarefa.setCategoria(categoria);
        tarefaRepository.save(tarefa);
    }

    public void desvincularCategoriaTarefa(Tarefa tarefa) {
        tarefa.setCategoria(null);
        tarefaRepository.save(tarefa);
    }

    public void deletarTarefa(Long id) {
        tarefaRepository.deleteById(id);
    }
}
