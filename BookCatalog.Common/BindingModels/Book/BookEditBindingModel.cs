using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookCatalog.Common.BindingModels.Book
{
    public class BookEditBindingModel
    {
         const string  maxCharError = "Maximum character input exceeded";

         public int Id { get; set; }

        [Required(ErrorMessage = "Title is required field")]
        [StringLength(200, ErrorMessage = maxCharError)]
        public string Title { get; set; }

        [Range(1, 2050, ErrorMessage ="Range must be between 1 and 2050")]
        public int? Year { get; set; }

        [StringLength(56, ErrorMessage = maxCharError)]
        public string Publisher { get; set; }

        [StringLength(56, ErrorMessage = maxCharError)]
        public string Author { get; set; }

        public string Note { get; set; }

        [StringLength(56, ErrorMessage = maxCharError)]
        public string Collection { get; set; }

        [Display(Name = "Already read")]
        public int Read { get; set; }

        public int? CategoryId { get; set; }

        public CategoryBindingModel Category { get; set; }
    }
}
