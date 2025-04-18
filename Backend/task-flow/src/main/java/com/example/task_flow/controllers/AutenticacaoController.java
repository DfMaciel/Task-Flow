package com.example.task_flow.controllers;

import com.example.task_flow.controllers.Dto.AutenticacaoDto;
import com.example.task_flow.entities.Usuario;
import com.example.task_flow.repository.UsuarioRepository;
import com.example.task_flow.services.AutenticacaoService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/autenticacao")
public class AutenticacaoController {

    @Autowired
    AutenticacaoService autenticacaoService;

    @Autowired
    UsuarioRepository usuarioRepository;

    @PostMapping()
    public ResponseEntity<?> autenticar(@RequestBody AutenticacaoDto autenticacaoDto) {
        Optional<Usuario> usuarioOpcional = autenticacaoService.autenticar(autenticacaoDto.email(), autenticacaoDto.senha());
        if (usuarioOpcional.isPresent()) {
            Usuario usuario = usuarioOpcional.get();
            String tokenAcesso = autenticacaoService.gerarTokenAcesso(usuario);
            String refreshToken = autenticacaoService.gerarRefreshToken(usuario);
            Map<String, String> tokens = new HashMap<>();
            tokens.put("tokenAcesso", tokenAcesso);
            tokens.put("refreshToken", refreshToken);
            return ResponseEntity.ok(tokens);
        }
        return ResponseEntity.status(401).body("Credenciais inválidas");
    }

    @PostMapping("/renovar")
    public ResponseEntity<?> renovarToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        System.out.println("Refresh token: " + refreshToken);
        try {
            Claims claims = autenticacaoService.parseToken(refreshToken);
            String email = claims.getSubject();
            System.out.println("Email: " + email);
            Optional<Usuario> userOpt = usuarioRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                System.out.println("Usuário encontrado: " + userOpt.get());
                String newAccessToken = autenticacaoService.gerarTokenAcesso(userOpt.get());
                System.out.println("Novo token de acesso: " + newAccessToken);
                Map<String, String> response = new HashMap<>();
                response.put("accessToken", newAccessToken);
                System.out.println("Novo token de acesso: " + newAccessToken);
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Refresh token inválido");
        }
        return ResponseEntity.status(401).body("Usuário não encontrado");
    }

}
