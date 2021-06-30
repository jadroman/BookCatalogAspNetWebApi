using BookCatalog.Common.BindingModels.Book;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Components
{
    public partial class CategoryTable
    {
        [Parameter]
        public List<CategoryBindingModel> Categories { get; set; }
    }
}
