package com.example.task_flow.controllers;

import com.example.task_flow.controllers.Dto.BaixarAnexoDto;
import com.example.task_flow.entities.Anexo;
import com.example.task_flow.entities.Usuario;
import com.example.task_flow.repository.UsuarioRepository;
import com.example.task_flow.services.AnexoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.util.List;

@RestController
@RequestMapping("/anexos")
public class AnexoController {

    @Autowired
    private AnexoService anexoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping()
    public ResponseEntity<List<Anexo>> listarAnexos() {
        List<Anexo> anexos = anexoService.listarAnexos();
        if (anexos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(anexos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Anexo> buscarAnexo(Long id) {
        Anexo anexo = anexoService.buscarAnexo(id);
        if (anexo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(anexo);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadAnexo(Authentication authentication, @PathVariable Long id) {
        Anexo anexo = anexoService.buscarAnexo(id);
        if (anexo == null) {
            return ResponseEntity.notFound().build();
        }
        String email = (String) authentication.getPrincipal();
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        Long usuarioId = anexo.getTarefa().getUsuario().getId();
        if (!usuario.getId().equals(usuarioId)) {
            return ResponseEntity.status(403).body("Usuário não tem acesso à esse anexo!");
        }
        try {
            BaixarAnexoDto baixarAnexo = anexoService.baixarAnexo(anexo.getId());
            if (baixarAnexo == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + baixarAnexo.nome() + "\"")
                    .body(baixarAnexo.resource());
        }  catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao baixar o anexo: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarAnexo(Authentication authentication, @PathVariable Long id) {
        Anexo anexo = anexoService.buscarAnexo(id);
        if (anexo == null) {
            return ResponseEntity.notFound().build();
        }
        String email = (String) authentication.getPrincipal();
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        Long usuarioId = anexo.getTarefa().getUsuario().getId();
        if (!usuario.getId().equals(usuarioId)) {
            return ResponseEntity.status(403).body("Usuário não tem acesso à esse anexo!");
        }
        try {
            anexoService.deletarAnexo(anexo);
            return ResponseEntity.ok("Anexo deletado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao deletar o anexo: " + e.getMessage());
        }
    }
}
