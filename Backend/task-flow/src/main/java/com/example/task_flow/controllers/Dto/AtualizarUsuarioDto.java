package com.example.task_flow.controllers.Dto;

import javax.swing.text.html.Option;
import java.util.Optional;

public record AtualizarUsuarioDto(
        Optional<String> nome,
        Optional<String> senhaAtual,
        Optional<String> senhaNova
) {
}
