package com.example.task_flow.controllers.Dto;

import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;

public record AnexoDto (
        Resource resource,
        String nome,
        MediaType mediaType
) {
}
