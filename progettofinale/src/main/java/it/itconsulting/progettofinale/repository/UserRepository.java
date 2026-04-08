package it.itconsulting.progettofinale.repository;

import it.itconsulting.progettofinale.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    
    User findByEmailAndPassword(String email, String password);
}