package com.example.task_flow.controllers.Dto;

import jakarta.validation.constraints.NotEmpty;

public record CadastroNotaDto(
        @NotEmpty String conteudo
) {
}
