package com.example.task_flow.controllers.Dto;

import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDate;
import java.util.Optional;

public record CadastroTarefaDto(
        @NotEmpty String titulo,
        @NotEmpty String descricao,
        @NotEmpty String prioridade,
        Optional<String> tempoEstimado,
        Optional<LocalDate> prazo,
        Optional<Long> idCategoria,
        Optional<Long> idTarefaPai
) {
}
