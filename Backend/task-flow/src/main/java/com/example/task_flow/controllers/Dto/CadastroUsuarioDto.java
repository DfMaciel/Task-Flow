package com.example.task_flow.controllers.Dto;

import jakarta.validation.constraints.NotEmpty;

public record CadastroUsuarioDto(
       @NotEmpty String nome,
       @NotEmpty String email,
       @NotEmpty String senha
) {
}
