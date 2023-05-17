using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class Register
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(8, MinimumLength=4)]
        public string Password { get; set; }
    }
}
