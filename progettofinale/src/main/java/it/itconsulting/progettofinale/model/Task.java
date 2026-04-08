package it.itconsulting.progettofinale.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import it.itconsulting.progettofinale.enumerazioni.Priorita;
import it.itconsulting.progettofinale.enumerazioni.Stato;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
@Table(name="tasks")
@ToString(exclude="user")
public class Task {
    @Id
    @GeneratedValue
    private long id;
    private String titolo;
    private String descrizione;
    @Enumerated(EnumType.STRING)
    private Stato stato;
    @Enumerated(EnumType.STRING)
    private Priorita priorita;
    @Column(name="data_creazione")
    private LocalDateTime dataCreazione;
    @Column(name="data_scadenza")
    private LocalDateTime dataScadenza;
    @ManyToOne
    @JoinColumn(name="user_id")
    @JsonIgnore
    private User user;
}
