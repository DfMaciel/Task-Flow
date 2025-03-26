package com.example.task_flow.controllers;

import com.example.task_flow.controllers.Dto.CadastroNotaDto;
import com.example.task_flow.entities.Nota;
import com.example.task_flow.entities.Tarefa;
import com.example.task_flow.entities.Usuario;
import com.example.task_flow.repository.TarefaRepository;
import com.example.task_flow.repository.UsuarioRepository;
import com.example.task_flow.services.NotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/notas")
public class NotaController {

    @Autowired
    private NotaService notaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TarefaRepository tarefaRepository;

    @GetMapping()
    public ResponseEntity<?> listarNotas(Long idTarefa) {
        try {
            List<Nota> notas = notaService.listarNotas(idTarefa);
            return ResponseEntity.ok(notas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatusCode.valueOf(404)).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarNota(Long idNota) {
        try {
            Nota nota = notaService.buscarNota(idNota);
            return ResponseEntity.ok(nota);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatusCode.valueOf(404)).body(e.getMessage());
        }
    }

    @PostMapping("/{idTarefa}")
    public ResponseEntity<?> cadastrarNota(Authentication authentication, @PathVariable Long idTarefa, @RequestBody CadastroNotaDto notaDto) {
        String email = (String) authentication.getPrincipal();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);

        Optional<Tarefa> tarefaOptional = tarefaRepository.findById(idTarefa);

        if (tarefaOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Tarefa não encontrada");
        }

        Tarefa tarefa = tarefaOptional.get();

        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }

        if (!tarefa.getUsuario().equals(usuarioOptional.get())) {
            return ResponseEntity.status(HttpStatusCode.valueOf(403)).body("Usuário não tem permissão para adicionar nota a essa tarefa");
        }

        String conteudo = notaDto.conteudo();

        try {
            Long idNota = notaService.cadastrarNota(tarefa, conteudo);
            return ResponseEntity.created(URI.create("/notas/" + idNota)).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatusCode.valueOf(404)).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarNota(Long idNota, String conteudo) {
        try {
            notaService.atualizarNota(idNota, conteudo);
            return ResponseEntity.ok("Nota atualizada");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatusCode.valueOf(404)).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarNota(Long idNota) {
        try {
            notaService.deletarNota(idNota);
            return ResponseEntity.ok("Nota deletada");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatusCode.valueOf(404)).body(e.getMessage());
        }
    }

}
