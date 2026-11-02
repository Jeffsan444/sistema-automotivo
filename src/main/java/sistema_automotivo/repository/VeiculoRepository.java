package sistema_automotivo.repository;

import sistema_automotivo.model.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VeiculoRepository
        extends JpaRepository<Veiculo, Long> {
}

