package it.itconsulting.progettofinale.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDto {
    @Email(message = "Email non valida!")
    @NotBlank(message = "L'email non può essere vuota o con soli spazi")
    private String email;
    @NotBlank(message = "La password non può essere vuota o con soli spazi")
    private String password;
}
