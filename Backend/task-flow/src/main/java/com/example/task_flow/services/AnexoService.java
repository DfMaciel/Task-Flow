package com.example.task_flow.services;

import com.example.task_flow.controllers.Dto.AnexoDto;
import com.example.task_flow.controllers.Dto.BaixarAnexoDto;
import com.example.task_flow.entities.Anexo;
import com.example.task_flow.entities.Tarefa;
import com.example.task_flow.repository.AnexoRepository;
import com.example.task_flow.repository.TarefaRepository;
import com.example.task_flow.utils.CloudinaryUpload;
import com.example.task_flow.utils.ExcluirArquivo;
//import com.example.task_flow.utils.SalvarArquivo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class AnexoService {

    @Autowired
    private AnexoRepository anexoRepository;

    @Autowired
    private TarefaRepository tarefaRepository;

//    @Autowired
//    private SalvarArquivo salvarArquivo;

    @Autowired
    private CloudinaryUpload cloudinaryUpload;

    @Autowired
    private ExcluirArquivo excluirArquivo;

    public Anexo salvarAnexo(MultipartFile arquivo, Tarefa tarefa, Long usuarioId) {
        try {
//            String diretorioArquivo =  salvarArquivo.salvar(arquivo, tarefa.getId(), usuarioId);
            String urlArquivo = cloudinaryUpload.cloudinaryUpload(arquivo);

            Anexo anexo = new Anexo();
            anexo.setCaminho(urlArquivo);
            anexo.setTarefa(tarefa);
            anexo.setNome(arquivo.getOriginalFilename());
            anexo.setTipo(arquivo.getContentType());
            anexo.setTamanho(arquivo.getSize());

            return anexoRepository.save(anexo);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erro ao salvar o arquivo: " + e.getMessage());
        }
    }

    public List<Anexo> listarAnexos() {
        return anexoRepository.findAll();
    }

    public Anexo buscarAnexo(Long id) {
        return anexoRepository.findById(id).orElse(null);
    }

    public AnexoDto baixarAnexo(Long id) throws MalformedURLException {
        Anexo anexo = anexoRepository.findById(id).orElse(null);
        if (anexo == null) {
            return null;
        }
        System.out.println("Anexo encontrado: " + anexo);
        Path caminho = Paths.get(anexo.getCaminho());
        Resource resource = new UrlResource(caminho.toUri());
        MediaType mediaType = MediaType.parseMediaType(anexo.getTipo());
        if (!resource.exists()) {
            return null;
        }
        return new AnexoDto(resource, anexo.getNome(), mediaType);
    }

    public void deletarAnexo(Anexo anexo) {
        Path caminho = Paths.get(anexo.getCaminho());
        excluirArquivo.excluir(caminho);
        anexo.getTarefa().getAnexos().remove(anexo);
        tarefaRepository.save(anexo.getTarefa());
        anexo.setTarefa(null);
        anexoRepository.delete(anexo);
    }
}
