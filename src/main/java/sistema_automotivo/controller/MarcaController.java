package sistema_automotivo.controller;

import sistema_automotivo.model.Marca;
import sistema_automotivo.service.MarcaService;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/marcas")
@CrossOrigin(origins = "*")
public class MarcaController {

    private final MarcaService service;

    public MarcaController(MarcaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Marca> listar() {
        return service.listar();
    }

    @PostMapping
    public Marca salvar(@RequestBody Marca marca) {
        return service.salvar(marca);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
