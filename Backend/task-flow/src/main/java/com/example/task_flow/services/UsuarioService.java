package com.example.task_flow.services;

import com.example.task_flow.controllers.Dto.CadastroUsuarioDto;
import com.example.task_flow.entities.Usuario;
import com.example.task_flow.repository.UsuarioRepository;
import jakarta.persistence.EntityExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Long cadastrarUsuario(CadastroUsuarioDto usuario) throws Exception {
        Usuario verificarUsuario = usuarioRepository.findByEmail(usuario.email()).orElse(null);
        if (verificarUsuario != null) {
            throw new Exception("Usuário já cadastrado");
        }
        var usuarioEntity = new Usuario();
        usuarioEntity.setNome(usuario.nome());
        usuarioEntity.setEmail(usuario.email());
        usuarioEntity.setSenha(usuario.senha());
        usuarioRepository.save(usuarioEntity);
        return usuarioEntity.getId();
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarUsuario(Long id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        return usuario.orElse(null);
    }


}
