//package com.example.task_flow.utils;
//
//import org.springframework.stereotype.Component;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.File;
//import java.io.IOException;
//import java.nio.file.Path;
//import java.util.UUID;
//
//@Component
//public class SalvarArquivo {
//
//    private final String caminhoBase = localizarPastaAnexos();
//
//    private String localizarPastaAnexos() {
//        File diretorioAtual = new File(System.getProperty("java.io.tmpdir"));
//        while (diretorioAtual != null) {
//            File pastaAnexos = new File(diretorioAtual, "anexos");
//            if (pastaAnexos.exists() && pastaAnexos.isDirectory()) {
//                return pastaAnexos.getAbsolutePath();
//            }
//            diretorioAtual = diretorioAtual.getParentFile();
//        }
//        throw new RuntimeException("Pasta 'anexos' não encontrada no caminho do projeto.");
//    }
//
//    public String salvar(MultipartFile arquivo, Long tarefaId, Long usuarioId) {
//        String caminhoUsuario = caminhoBase + File.separator + "usuario_" + usuarioId;
//        String caminhoTarefa = caminhoUsuario + File.separator + "tarefa_" + tarefaId;
//
//        try {
//            File pastaTarefa = new File(caminhoTarefa);
//            if (!pastaTarefa.exists()) {
//                pastaTarefa.mkdirs();
//            }
//
//            String nomeOriginal = arquivo.getOriginalFilename();
//            String nomeUnico = UUID.randomUUID().toString() + "_" + nomeOriginal;
//            String caminhoCompleto = caminhoTarefa + File.separator + nomeUnico;
//
//            File file = new File(caminhoCompleto);
//            arquivo.transferTo(file);
//
//            System.out.println("Arquivo salvo em: " + caminhoCompleto);
//            return caminhoCompleto;
//        } catch (IOException ex) {
//            ex.printStackTrace();
//            throw new RuntimeException(ex);
//        }
//    }
//}
