package it.itconsulting.progettofinale.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import it.itconsulting.progettofinale.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long>{
    
}
