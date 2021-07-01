using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookCatalog.Common.BindingModels.Category
{
    public class CategoryEditBindingModel
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required field")]
        [StringLength(48)]
        public string Name { get; set; }
    }
}
