package com.example.task_flow.utils;

import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class VerificadorData {

    public boolean verificarDataConclusao(LocalDateTime dataInicio, LocalDateTime dataConclusao) {
        if (dataInicio != null && dataConclusao != null) {
            return dataConclusao.isAfter(dataInicio);
        }
        return true;
    }
}
