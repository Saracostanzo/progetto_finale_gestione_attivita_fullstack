package it.itconsulting.progettofinale.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import it.itconsulting.progettofinale.dto.TaskDto;
import it.itconsulting.progettofinale.enumerazioni.Priorita;
import it.itconsulting.progettofinale.enumerazioni.Stato;
import it.itconsulting.progettofinale.model.Errore;
import it.itconsulting.progettofinale.model.Task;
import it.itconsulting.progettofinale.service.TaskService;




@RestController
@CrossOrigin(origins = { "http://127.0.0.1:5501", "http://localhost:5501"})
public class TaskController {
    @Autowired
    private TaskService taskService;

    @GetMapping("/api/users/{id}/tasks")
    public ResponseEntity<List<Task>> getAll(
            @PathVariable long id,
            @RequestParam(required = false) Stato stato,
            @RequestParam(required = false) Priorita priorita) {
        
        List<Task> tasks = taskService.getByFilters(id, stato, priorita);
        
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/api/users/{id}/tasks")
    public ResponseEntity<Object> create(@PathVariable long id, @RequestBody(required=false) @Validated TaskDto tDto, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            Errore errore = new Errore();
            errore.setMessaggio(bindingResult.getAllErrors().stream().map(obError -> obError.getDefaultMessage()).collect(Collectors.joining(","))); 
            errore.setDataErrore(LocalDateTime.now());
            return ResponseEntity.badRequest().body(errore); 
        }
        Task task = null;
        try {
            task = taskService.create(tDto, id);
            return ResponseEntity.status(HttpStatus.CREATED).body(task);
        } catch (IllegalArgumentException e) {
            Errore error = new Errore();
            error.setMessaggio(e.getMessage());
            error.setDataErrore(LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error); 
        }   
    }

    @PutMapping("/api/tasks/{id}")
    public ResponseEntity<Object> update(@RequestBody(required=false) @Validated TaskDto tDto, BindingResult bindingResult, @PathVariable long id) {
        if(bindingResult.hasErrors()) {
            Errore errore = new Errore();
            errore.setMessaggio(bindingResult.getAllErrors().stream().map(obError -> obError.getDefaultMessage()).collect(Collectors.joining(","))); 
            errore.setDataErrore(LocalDateTime.now());
            return ResponseEntity.badRequest().body(errore); 
        }
        Task task = null;
        try {
            task = taskService.update(tDto, id);
            return ResponseEntity.status(HttpStatus.CREATED).body(task);
        } catch (IllegalArgumentException e) {
            Errore error = new Errore();
            error.setMessaggio(e.getMessage());
            error.setDataErrore(LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error); 
        } 
    }
    
    @DeleteMapping("/api/tasks/{id}") 
    public void delete(@PathVariable long id){
      taskService.delete(id);
    }

}
