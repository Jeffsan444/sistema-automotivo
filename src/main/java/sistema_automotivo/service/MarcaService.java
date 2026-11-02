package sistema_automotivo.service;

import sistema_automotivo.model.Marca;
import sistema_automotivo.repository.MarcaRepository;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MarcaService {

    private final MarcaRepository repository;

    public MarcaService(MarcaRepository repository) {
        this.repository = repository;
    }

    public List<Marca> listar() {
        return repository.findAll();
    }

    public Marca salvar(Marca marca) {
        return repository.save(marca);
    }

    public void excluir(Long id) {
        repository.deleteById(id);
    }
}

