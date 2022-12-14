using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public DateTime? DataEvento { get; set; }
        [Required(ErrorMessage ="O campo {0} é obrigatorio"),
        // MinLength(3,ErrorMessage ="{0} deve ter no minimo 4 caracteres."),
        // MaxLength(50,ErrorMessage ="{0} deve ter no minimo 50 caracteres.")
        StringLength(50,MinimumLength =3,
                    ErrorMessage ="Intervalo permitido de 3 a 50 caracteres")
        ]
        public string Tema { get; set; }
        [Display(Name ="Qtd Pessoas")]
        [Range(1,120000,ErrorMessage ="{0} não pode ser menor que 1 e maior que 120.000")]
        public int QtdPessoas { get; set; }
        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$",
                            ErrorMessage ="Não é uma imagem valida.(gif, jpg,jpeg,bmp ou png)")]
        public string ImagemURL { get; set; }
        [Required(ErrorMessage ="O campo {0} é obrigatorio")]
        [Phone(ErrorMessage ="O campo {0} está com numero invalido")]
        public string Telefone { get; set; }
        [Required(ErrorMessage ="O campo {0} é obrigatorio")]
        [Display(Name ="e-mail")]
        [EmailAddress(ErrorMessage ="O campo {0} prescisa ser email valido")]
        public string Email { get; set; }
        public IEnumerable<LoteDto> Lotes { get; set; }
        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
        public IEnumerable<PalestranteDto> Palestrantes { get; set; }
        public string Lote { get; set; }

    
    }
}