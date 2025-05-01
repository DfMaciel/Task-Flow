package com.example.task_flow.controllers;

import com.example.task_flow.controllers.Dto.AtualizarUsuarioDto;
import com.example.task_flow.controllers.Dto.CadastroUsuarioDto;
import com.example.task_flow.entities.Usuario;
import com.example.task_flow.repository.UsuarioRepository;
import com.example.task_flow.services.UsuarioService;
import jakarta.persistence.EntityExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping()
    public ResponseEntity<?> cadastrarUsuario(@RequestBody CadastroUsuarioDto usuario) {
        System.out.println("recebendo requisição");
        try {
            var usuarioId = usuarioService.cadastrarUsuario(usuario);
            return ResponseEntity.created(URI.create("/usuarios/" + usuarioId.toString())).body("Usuário cadastrado");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping()
    public List<Usuario> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listarUsuarios();
        return usuarios;
    }

    @GetMapping("/email")
    public ResponseEntity<?> buscarUsuarioPorEmail(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        Usuario usuario = usuarioOptional.get();

        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarUsuario(@PathVariable Long id) {
        Usuario usuario = usuarioService.buscarUsuario(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }

    @PutMapping()
    public ResponseEntity<?> atualizarUsuario(Authentication authentication, @RequestBody AtualizarUsuarioDto usuarioDto) {
        String email = (String) authentication.getPrincipal();
        System.out.println("Recebendo requisição de atualização de usuário: ");
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        Usuario usuario = usuarioOptional.get();
        try {
            usuarioService.atualizarUsuario(usuario, usuarioDto);
            return ResponseEntity.ok("Usuário atualizado");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public String deletarUsuario() {
        return "Usuário deletado";
    }
}
