package it.itconsulting.progettofinale.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Errore {
    private String messaggio;
    private LocalDateTime dataErrore;
}