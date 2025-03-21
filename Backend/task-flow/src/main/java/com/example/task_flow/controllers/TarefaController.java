package com.example.task_flow.controllers;

import com.example.task_flow.controllers.Dto.CadastroTarefaDto;
import com.example.task_flow.entities.Tarefa;
import com.example.task_flow.entities.Usuario;
import com.example.task_flow.repository.UsuarioRepository;
import com.example.task_flow.services.TarefaService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tarefas")
public class TarefaController {

    @Autowired
    private TarefaService tarefaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public ResponseEntity<?> listarTarefas(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        List<Tarefa> tarefas = tarefaService.listarTarefas(usuarioOptional.get());
        return ResponseEntity.ok(tarefas);
    }

    public ResponseEntity<?> buscarTarefa(Long id) {
        return tarefaService.buscarTarefa(id);
    }

    public ResponseEntity<?> cadastrarTarefa(Authentication authentication, CadastroTarefaDto cadastroTarefaDto) {
        String email = (String) authentication.getPrincipal();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        return tarefaService.cadastrarTarefa(usuarioOptional.get(), cadastroTarefaDto);
    }
}
