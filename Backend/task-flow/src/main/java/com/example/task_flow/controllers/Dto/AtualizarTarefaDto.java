package com.example.task_flow.controllers.Dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

public record AtualizarTarefaDto(
        Optional<String> titulo,
        Optional<String> descricao,
        Optional<String> status,
        Optional<String> prioridade,
        Optional<String> tempoEstimado,
        Optional<LocalDate> prazo,
        Optional<LocalDateTime> dataInicio,
        Optional<LocalDateTime> dataConclusao
        ) {
}
