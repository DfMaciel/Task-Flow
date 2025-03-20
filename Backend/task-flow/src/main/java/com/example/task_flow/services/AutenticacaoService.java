package com.example.task_flow.services;

import com.example.task_flow.entities.Usuario;
import com.example.task_flow.repository.UsuarioRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Optional;

@Service
public class AutenticacaoService {

    private final String jwtSecret;
    private final long jwtExpirationMs;
    private final long jwtRefreshExpirationMs;
    private final SecretKey key;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public AutenticacaoService(
                               @Value("${jwt.secret}") String jwtSecret,
                               @Value("${jwt.expiration}") String jwtExpirationMs,
                               @Value("${jwt.refresh.expiration}") String jwtRefreshExpirationMs) {
        this.jwtSecret = jwtSecret;
        this.jwtExpirationMs = Long.parseLong(jwtExpirationMs.trim());
        this.jwtRefreshExpirationMs = Long.parseLong(jwtRefreshExpirationMs.trim());
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public Optional<Usuario> autenticar(String email, String senha) {
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        if (usuario.isPresent()) {
                String senhaUsuario = usuario.get().getSenha();
                if (senha.equals(senhaUsuario)) {
                    return usuario;
                }
        }
        return Optional.empty();
    }

    public String gerarTokenAcesso(Usuario usuario) {
        return Jwts.builder()
                .setSubject(usuario.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String gerarRefreshToken(Usuario usuario) {
        return Jwts.builder()
                .setSubject(usuario.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtRefreshExpirationMs))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
