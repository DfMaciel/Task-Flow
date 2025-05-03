package com.example.task_flow.controllers.Dto;

import org.springframework.core.io.Resource;

public record BaixarAnexoDto (
        Resource resource,
        String nome
) {
}
