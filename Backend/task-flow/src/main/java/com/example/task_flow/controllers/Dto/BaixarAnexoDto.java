package com.example.task_flow.controllers.Dto;

public record BaixarAnexoDto (
        Long id,
        String nome,
        String tipo,
        Long tamanho,
        String urlConteudo,
        String urlBaixar
){
}
