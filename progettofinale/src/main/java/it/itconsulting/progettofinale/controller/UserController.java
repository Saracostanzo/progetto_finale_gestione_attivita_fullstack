package it.itconsulting.progettofinale.controller;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import it.itconsulting.progettofinale.dto.UserDto;
import it.itconsulting.progettofinale.model.Errore;
import it.itconsulting.progettofinale.model.User;
import it.itconsulting.progettofinale.service.UserService;

@RestController
@CrossOrigin(origins = {"http://127.0.0.1:5501", "http://localhost:5501"})
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/api/users/register")
    public ResponseEntity<Object> register(@RequestBody(required=false) @Validated UserDto uDto, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            Errore errore = new Errore();
            errore.setMessaggio(bindingResult.getAllErrors().stream().map(obError -> obError.getDefaultMessage()).collect(Collectors.joining(","))); 
            errore.setDataErrore(LocalDateTime.now());
            return ResponseEntity.badRequest().body(errore); 
        }
        User user = null;
        try {
            user = userService.create(uDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (IllegalArgumentException e) {
            Errore error = new Errore();
            error.setMessaggio(e.getMessage());
            error.setDataErrore(LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error); 
        }  
    }

    @PostMapping("/api/users/login")
    public ResponseEntity<Object> login(@RequestBody(required=false) @Validated UserDto uDto, BindingResult bindingResult) {
        
    }
}