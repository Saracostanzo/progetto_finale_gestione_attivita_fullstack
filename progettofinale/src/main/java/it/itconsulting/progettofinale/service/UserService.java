package it.itconsulting.progettofinale.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.itconsulting.progettofinale.dto.UserDto;
import it.itconsulting.progettofinale.model.User;
import it.itconsulting.progettofinale.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User create(UserDto uDto) {
        if(uDto != null) {
            User u = new User();
            u.setEmail(uDto.getEmail());
            u.setPassword(uDto.getPassword());
            u.setUsername(uDto.getUsername());
            return userRepository.save(u);
        } else {
        throw new IllegalArgumentException("User " + uDto + " non valido");
        }
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User getUser(long id) {
        return userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User con id: " + id + " non trovato"));
    }

    public User update(UserDto uDto, long id) {
        User userDaModificare = getUser(id);

        if(uDto != null) {
            userDaModificare.setEmail(uDto.getEmail());
            userDaModificare.setPassword(uDto.getPassword());
            userDaModificare.setUsername(uDto.getUsername());
            return userRepository.save(userDaModificare);
        } else {
            throw new IllegalArgumentException("User passato come parametro " + uDto + " non valido");
        }
    }
    public void delete(long id) {
        userRepository.deleteById(id);
    }

    public User getByEmailAndPassword(String email, String password) {
        User user = userRepository.findByEmailAndPassword(email, password);
        if(user != null) {
            return user;
        }
        throw new IllegalArgumentException("User non trovato!");
    }
}