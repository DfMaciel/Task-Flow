package com.example.task_flow.controllers.Dto;

import jakarta.validation.constraints.NotEmpty;

public record AutenticacaoDto(
        @NotEmpty String email,
        @NotEmpty String senha
) {
}
