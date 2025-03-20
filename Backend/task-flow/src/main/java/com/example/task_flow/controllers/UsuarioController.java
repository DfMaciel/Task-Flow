package com.example.task_flow.controllers;

import com.example.task_flow.controllers.Dto.CadastroUsuarioDto;
import com.example.task_flow.entities.Usuario;
import com.example.task_flow.services.UsuarioService;
import jakarta.persistence.EntityExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping()
    public ResponseEntity<?> cadastrarUsuario(@RequestBody CadastroUsuarioDto usuario) {
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

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarUsuario(@PathVariable Long id) {
        Usuario usuario = usuarioService.buscarUsuario(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/{id}")
    public String atualizarUsuario() {
        return "Usuário atualizado";
    }

    @DeleteMapping("/{id}")
    public String deletarUsuario() {
        return "Usuário deletado";
    }
}
