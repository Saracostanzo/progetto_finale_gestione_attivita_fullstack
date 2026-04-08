package it.itconsulting.progettofinale.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.itconsulting.progettofinale.dto.TaskDto;
import it.itconsulting.progettofinale.model.Task;
import it.itconsulting.progettofinale.model.User;
import it.itconsulting.progettofinale.repository.TaskRepository;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserService userService;

    public Task create(TaskDto tDto) {
        
        if(tDto != null) {
            User user = userService.getUser(tDto.getUserId());
            Task t = new Task();
            t.setTitolo(tDto.getTitolo());
            t.setDataCreazione(tDto.getDataCreazione());
            t.setDataScadenza(tDto.getDataScadenza());
            t.setDescrizione(tDto.getDescrizione());
            t.setStato(tDto.getStato());
            t.setPriorita(tDto.getPriorita());
            t.setUser(user);
            return taskRepository.save(t);
        } else {
        throw new IllegalArgumentException("Task " + tDto + " non valida");
        }
    }

    public List<Task> getAll() {
        return taskRepository.findAll();
    }

    public Task getTask(long id) {
        return taskRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Task con id: " + id + " non trovata"));
    }

    public void delete(long id) {
        taskRepository.deleteById(id);
    }

    public Task update(TaskDto tDto, long id) {
        Task taskDaModificare = getTask(id);

        if(tDto != null) {
            
            taskDaModificare.setTitolo(tDto.getTitolo());
            taskDaModificare.setDataCreazione(tDto.getDataCreazione());
            taskDaModificare.setDataScadenza(tDto.getDataScadenza());
            taskDaModificare.setDescrizione(tDto.getDescrizione());
            taskDaModificare.setStato(tDto.getStato());
            taskDaModificare.setPriorita(tDto.getPriorita());
            
            if(tDto.getUserId() != taskDaModificare.getUser().getId()) {
                User user = userService.getUser(tDto.getUserId());
                taskDaModificare.setUser(user); }

            return taskRepository.save(taskDaModificare);
        } else {
            throw new IllegalArgumentException("Task passata come parametro " + tDto + " non valida");
        }
    }
}
