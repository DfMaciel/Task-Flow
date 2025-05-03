package com.example.task_flow.utils;

import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.file.Path;

@Component
public class ExcluirArquivo {

    public void excluir(Path caminho) {
        File file = caminho.toFile();
        if (file.exists()) {
            if (file.delete()) {
                System.out.println("Arquivo excluído: " + caminho);
            } else {
                System.out.println("Erro ao excluir arquivo: " + caminho);
                throw new RuntimeException("Erro ao excluir arquivo: " + caminho);
            }
        } else {
            System.out.println("Arquivo não encontrado: " + caminho);
            throw new RuntimeException("Arquivo não encontrado: " + caminho);
        }
    }
}
