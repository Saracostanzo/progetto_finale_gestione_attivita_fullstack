package it.itconsulting.progettofinale.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import it.itconsulting.progettofinale.enumerazioni.Priorita;
import it.itconsulting.progettofinale.enumerazioni.Stato;
import it.itconsulting.progettofinale.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long>{
    public List<Task> findByUserId(long id);
    @Query("select t from Task t where t.user.id=:id and t.stato=:stato")
    public List<Task> findByStatoAndUserId(long id, Stato stato);

    @Query("select t from Task t where t.user.id=:id and t.priorita=:priorita")
    public List<Task> findByPrioritaAndUserId(long id, Priorita priorita);
}
