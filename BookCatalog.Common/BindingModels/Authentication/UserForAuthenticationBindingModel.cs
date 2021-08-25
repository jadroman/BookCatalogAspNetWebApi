using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookCatalog.Common.BindingModels.Authentication
{
    public class UserForAuthenticationBindingModel
    {
        [Required(ErrorMessage = "Email is required.")]
        [StringLength(56)]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(56)]
        public string Password { get; set; }
    }
}
