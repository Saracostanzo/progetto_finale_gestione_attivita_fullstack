package it.itconsulting.progettofinale.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserDto {
    @NotBlank(message = "Lo username non può essere vuoto o con soli spazi")
    private String username;
    @NotBlank(message = "La password non può essere vuoto o con soli spazi")
    private String password;
    @NotBlank(message = "L'email non può essere vuota o con soli spazi")
    @Email(message = "Email non valida")
    private String email;
}
