package it.itconsulting.progettofinale.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import it.itconsulting.progettofinale.enumerazioni.Priorita;
import it.itconsulting.progettofinale.enumerazioni.Stato;
import it.itconsulting.progettofinale.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long>{
    public List<Task> findByUserId(long id);
    List<Task> findByUserIdAndStato(long userId, Stato stato);
    List<Task> findByUserIdAndPriorita(long userId, Priorita priorita);
    List<Task> findByUserIdAndStatoAndPriorita(long userId, Stato stato, Priorita priorita);
}
