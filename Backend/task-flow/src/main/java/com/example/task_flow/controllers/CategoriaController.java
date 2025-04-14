package com.example.task_flow.controllers;

import com.example.task_flow.controllers.Dto.CadastroCategoriaDto;
import com.example.task_flow.entities.Categoria;
import com.example.task_flow.entities.Tarefa;
import com.example.task_flow.entities.Usuario;
import com.example.task_flow.repository.CategoriaRepository;
import com.example.task_flow.repository.UsuarioRepository;
import com.example.task_flow.services.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping()
    public ResponseEntity<?> listarCategorias(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);

        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        List<Categoria> categorias = categoriaService.listarCategorias(usuarioOptional.get());
        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarCategoria(@PathVariable Long id) {
        try {
            Categoria categoria = categoriaService.buscarCategoria(id);
            return ResponseEntity.ok(categoria);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping()
    public ResponseEntity<?> cadastrarCategoria(Authentication authentication, @RequestBody CadastroCategoriaDto categoriaDto) {
        String email = (String) authentication.getPrincipal();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);

        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        try {
            var categoriaId = categoriaService.cadastrarCategoria(usuarioOptional.get(), categoriaDto);
            return ResponseEntity.created(URI.create("/categorias/" + categoriaId.toString())).body("Categoria cadastrada");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarCategoria(Authentication authentication, @PathVariable Long id, @RequestBody CadastroCategoriaDto categoriaDto) {
        String email = (String) authentication.getPrincipal();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);

        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }

        Optional<Categoria> categoriaOptional = categoriaRepository.findById(id);
        if (categoriaOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Categoria não encontrada");
        }
        Categoria categoria = categoriaOptional.get();

        if (!categoria.getUsuario().equals(usuarioOptional.get())) {
            return ResponseEntity.status(403).body("Usuário não tem permissão para atualizar essa categoria");
        }

        try {
            categoriaService.atualizarCategoria(categoria, categoriaDto);
            return ResponseEntity.ok("Categoria atualizada com sucesso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarCategoria(Authentication authentication, @PathVariable Long id) {
        String email = (String) authentication.getPrincipal();
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(email);
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }
        Optional<Categoria> categoriaOptional = categoriaRepository.findById(id);
        if (categoriaOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Tarefa não encontrada");
        }
        Categoria categoria = categoriaOptional.get();
        if (!categoria.getUsuario().equals(usuarioOptional.get())) {
            return ResponseEntity.status(403).body("Usuário não tem permissão para deletar a tarefa");
        }
        try {
            categoriaService.deletarCategoria(id);
            return ResponseEntity.ok("Categoria deletada com sucesso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
