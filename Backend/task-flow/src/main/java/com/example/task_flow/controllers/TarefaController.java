package com.example.task_flow.controllers;

import com.example.task_flow.controllers.Dto.AtualizarTarefaDto;
import com.example.task_flow.controllers.Dto.CadastroTarefaDto;
import com.example.task_flow.entities.Tarefa;
import com.example.task_flow.entities.Usuario;
import com.example.task_flow.repository.TarefaRepository;
import com.example.task_flow.repository.UsuarioRepository;
import com.example.task_flow.services.AnexoService;
import com.example.task_flow.services.TarefaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/tarefas")
public class TarefaController {

    @Autowired
    private TarefaService tarefaService;

    @Autowired
    private AnexoService anexoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TarefaRepository tarefaRepository;

    @GetMapping()
    public ResponseEntity<?> listarTarefas(Authentication authentication) {
        System.out.println("Listando tarefas: " + authentication);
        String email = (String) authentication.getPrincipal();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        List<Tarefa> tarefas = tarefaService.listarTarefas(usuarioOptional.get());
        return ResponseEntity.ok(tarefas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarTarefa(@PathVariable("id") Long id, @RequestHeader("Host") String host) {
        try {
            Tarefa tarefa = tarefaService.buscarTarefa(id);
            if (tarefa == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(tarefa);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatusCode.valueOf(404)).body(e.getMessage());
        }
    }

    @PostMapping()
    public ResponseEntity<?> cadastrarTarefa(Authentication authentication, @RequestBody CadastroTarefaDto cadastroTarefaDto) {
        String email = (String) authentication.getPrincipal();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        try {
            var tarefaId = tarefaService.cadastrarTarefa(usuarioOptional.get(), cadastroTarefaDto);
            return ResponseEntity.created(URI.create("/tarefas/" + tarefaId.toString())).body("Tarefa cadastrado");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/anexo/{tarefaId}")
    public ResponseEntity<?> adicionarAnexo(Authentication authentication, @PathVariable Long tarefaId, @RequestParam("file") MultipartFile file) {
        String email = (String) authentication.getPrincipal();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        Optional<Tarefa> tarefaOptional = tarefaRepository.findById(tarefaId);
        if (tarefaOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Tarefa não encontrada");
        }
        Tarefa tarefa = tarefaOptional.get();
        if (!tarefa.getUsuario().equals(usuarioOptional.get())) {
            return ResponseEntity.status(403).body("Usuário não tem permissão para adicionar anexo na tarefa");
        }
        try {
            anexoService.salvarAnexo(file, tarefa, usuarioOptional.get().getId());
            return ResponseEntity.ok("Anexo adicionado");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarTarefa(Authentication authentication, @PathVariable Long id, @RequestBody AtualizarTarefaDto atualizarTarefaDto) {
        String email = (String) authentication.getPrincipal();
        System.out.println(atualizarTarefaDto);
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        Optional<Tarefa> tarefaOptional = tarefaRepository.findById(id);
        if (tarefaOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Tarefa não encontrada");
        }
        Tarefa tarefa = tarefaOptional.get();
        if (!tarefa.getUsuario().equals(usuarioOptional.get())) {
            return ResponseEntity.status(403).body("Usuário não tem permissão para atualizar a tarefa");
        }
        try {
            tarefaService.atualizarTarefa(tarefa, atualizarTarefaDto);
            return ResponseEntity.ok("Tarefa atualizada");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> atualizarStatusTarefa(Authentication authentication, @PathVariable Long id, @RequestBody Map<String, String> requestBody) {
        String email = (String) authentication.getPrincipal();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        Optional<Tarefa> tarefaOptional = tarefaRepository.findById(id);
        if (tarefaOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Tarefa não encontrada");
        }
        Tarefa tarefa = tarefaOptional.get();
        if (!tarefa.getUsuario().equals(usuarioOptional.get())) {
            return ResponseEntity.status(403).body("Usuário não tem permissão para atualizar a tarefa");
        }
        String status = requestBody.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().body("Status não informado");
        }
        try {
            tarefaService.atualizarStatusTarefa(tarefa, status);
            return ResponseEntity.ok("Status da tarefa atualizado");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/prioridade")
    public ResponseEntity<?> atualizarStatusPrioridade(Authentication authentication, @PathVariable Long id, @RequestBody Map<String, String> requestBody) {
        String email = (String) authentication.getPrincipal();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        Optional<Tarefa> tarefaOptional = tarefaRepository.findById(id);
        if (tarefaOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Tarefa não encontrada");
        }
        Tarefa tarefa = tarefaOptional.get();
        if (!tarefa.getUsuario().equals(usuarioOptional.get())) {
            return ResponseEntity.status(403).body("Usuário não tem permissão para atualizar a tarefa");
        }
        String prioridade = requestBody.get("prioridade");
        if (prioridade == null) {
            return ResponseEntity.badRequest().body("Prioridade não informada");
        }
        try {
            tarefaService.atualizarPrioridadeTarefa(tarefa, prioridade);
            return ResponseEntity.ok("Status da tarefa atualizado");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/categoria/{categoriaId}")
    public ResponseEntity<?> atualizarCategoriaTarefa(Authentication authentication, @PathVariable Long id, @PathVariable Long categoriaId) {
        String email = (String) authentication.getPrincipal();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        Optional<Tarefa> tarefaOptional = tarefaRepository.findById(id);
        if (tarefaOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Tarefa não encontrada");
        }
        Tarefa tarefa = tarefaOptional.get();
        if (!tarefa.getUsuario().equals(usuarioOptional.get())) {
            return ResponseEntity.status(403).body("Usuário não tem permissão para atualizar a tarefa");
        }
        try {
            tarefaService.atualizarCategoriaTarefa(tarefa, categoriaId);
            return ResponseEntity.ok("Categoria da tarefa atualizada");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/categoria/desvincular")
    public ResponseEntity<?> desvincularCategoriaTarefa(Authentication authentication, @PathVariable Long id) {
        String email = (String) authentication.getPrincipal();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        Optional<Tarefa> tarefaOptional = tarefaRepository.findById(id);
        if (tarefaOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Tarefa não encontrada");
        }
        Tarefa tarefa = tarefaOptional.get();
        if (!tarefa.getUsuario().equals(usuarioOptional.get())) {
            return ResponseEntity.status(403).body("Usuário não tem permissão para atualizar a tarefa");
        }
        try {
            tarefaService.desvincularCategoriaTarefa(tarefa);
            return ResponseEntity.ok("Categoria da tarefa removida");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarTarefa(Authentication authentication, @PathVariable Long id) {
        String email = (String) authentication.getPrincipal();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        Optional<Tarefa> tarefaOptional = tarefaRepository.findById(id);
        if (tarefaOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Tarefa não encontrada");
        }
        Tarefa tarefa = tarefaOptional.get();
        if (!tarefa.getUsuario().equals(usuarioOptional.get())) {
            return ResponseEntity.status(403).body("Usuário não tem permissão para deletar a tarefa");
        }
        try {
            tarefaService.deletarTarefa(id);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok("Tarefa deletada");
    }
}
