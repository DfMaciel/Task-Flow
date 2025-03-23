package com.example.task_flow.controllers;

import com.example.task_flow.controllers.Dto.AtualizarTarefaDto;
import com.example.task_flow.controllers.Dto.CadastroTarefaDto;
import com.example.task_flow.entities.Tarefa;
import com.example.task_flow.entities.Usuario;
import com.example.task_flow.repository.TarefaRepository;
import com.example.task_flow.repository.UsuarioRepository;
import com.example.task_flow.services.TarefaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tarefas")
public class TarefaController {

    @Autowired
    private TarefaService tarefaService;

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
    public ResponseEntity<?> buscarTarefa(@PathVariable Long id) {
        try {
            Tarefa tarefa = tarefaService.buscarTarefa(id);
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
            return tarefaService.cadastrarTarefa(usuarioOptional.get(), cadastroTarefaDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarTarefa(Authentication authentication, @PathVariable Long id, @RequestBody AtualizarTarefaDto atualizarTarefaDto) {
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
            tarefaService.atualizarTarefa(tarefa, atualizarTarefaDto);
            return ResponseEntity.ok("Tarefa atualizada");
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
        tarefaRepository.delete(tarefa);
        return ResponseEntity.ok("Tarefa deletada");
    }
}
