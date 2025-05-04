package com.example.task_flow.utils;

import com.example.task_flow.controllers.Dto.BaixarAnexoDto;
import com.example.task_flow.entities.Anexo;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MapearAnexoDto {
    public List<BaixarAnexoDto> mapearAnexoDto(List<Anexo> anexos, String urlBase) {
        return anexos.stream()
                .map(anexo -> new BaixarAnexoDto(
                        anexo.getId(),
                        anexo.getNome(),
                        anexo.getTipo(),
                        anexo.getTamanho(),
                        urlBase + "/anexos/visualizar" + anexo.getId(),
                        urlBase + "/anexos/download/" + anexo.getId()
                ))
                .collect(Collectors.toList());
    }
}
