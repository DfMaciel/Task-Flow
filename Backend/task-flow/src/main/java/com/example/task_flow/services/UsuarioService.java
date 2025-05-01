package com.example.task_flow.services;

import com.example.task_flow.controllers.Dto.AtualizarUsuarioDto;
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
            throw new Exception("Esse email já está em uso!");
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

    public void atualizarUsuario(Usuario usuario, AtualizarUsuarioDto usuarioDto) {
        System.out.println("Atualizando usuário: " + usuarioDto);
        if (usuarioDto.nome().isPresent()) {
            usuario.setNome(usuarioDto.nome().get());
        }
        if (usuarioDto.senhaNova().isPresent()) {
            var senhaNova = usuarioDto.senhaNova().get();
            System.out.println("Senha nova: " + senhaNova);
            if (usuarioDto.senhaAtual().isPresent()) {
                var senhaAtual = usuarioDto.senhaAtual().get();
                System.out.println("Senha atual: " + senhaAtual);
                if (!usuario.getSenha().equals(senhaAtual)) {
                    throw new IllegalArgumentException("Senha atual incorreta");
                }
                usuario.setSenha(senhaNova);
            } else {
                throw new IllegalArgumentException("Senha atual não informada");
            }
        }

        usuarioRepository.save(usuario);
    }

}
