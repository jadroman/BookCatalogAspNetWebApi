using BookCatalog.Common.BindingModels.Category;
using BookCatalog.WebBlz.HttpRepository;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Pages.Category
{
    public partial class CategoryCreate
    {
        private CategoryEditBindingModel _category = new();

        [Inject]
        public ICategoryHttpRepository CategoryRepo { get; set; }

        [Inject]
        public NavigationManager Navigation { get; set; }

        private async Task Create()
        {
            await CategoryRepo.CreateCategory(_category);
            Navigation.NavigateTo("/categories");
        }
    }
}
