package it.itconsulting.progettofinale.dto;

import java.time.LocalDateTime;

import it.itconsulting.progettofinale.enumerazioni.Priorita;
import it.itconsulting.progettofinale.enumerazioni.Stato;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class TaskDto {
  
    @NotBlank(message = "Il titolo della task non può essere vuoto o con soli spazi")
    private String titolo;
    @NotBlank(message = "La descrizione della task non può essere vuota o con soli spazi")
    private String descrizione;
    @NotNull(message = "Lo stato della task non può essere vuoto o con soli spazi")
    private Stato stato;
    @NotNull(message = "La piorità della task non può essere vuota o con soli spazi")
    private Priorita priorita;
    // la setta java in automatico
    private LocalDateTime dataCreazione;
    @FutureOrPresent(message = "La data di scadenza della task può essere successiva o uguale a quella odierna")
    @NotNull(message = "La data di scadenza della task non può essere vuota o con soli spazi")
    private LocalDateTime dataScadenza;
    @NotNull(message = "L'id dello user non può essere vuoto o con soli spazi")
    @Positive(message = "L'id dello user non può assumere valori negativi")
    private long userId;
}
