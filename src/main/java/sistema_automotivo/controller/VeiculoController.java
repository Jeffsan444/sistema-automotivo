package sistema_automotivo.controller;

import sistema_automotivo.model.Veiculo;
import sistema_automotivo.service.VeiculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/veiculos")
@CrossOrigin(origins = "*")
public class VeiculoController {

    @Autowired
    private VeiculoService service;

    @GetMapping
    public List<Veiculo> listarTodos() {
        return service.listarTodos();
    }

    @PostMapping
    public Veiculo salvar(@RequestBody Veiculo veiculo) {
        return service.salvar(veiculo);

        
    }

    @DeleteMapping("/{id}")
     public void excluir(@PathVariable Long id) {
    service.excluir(id);
}
    @GetMapping("/{id}")
    public Veiculo buscarPorId(@PathVariable Long id) {
    return service.buscarPorId(id);
}

}

