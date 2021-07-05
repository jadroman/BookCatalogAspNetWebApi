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
        CategoryEditBindingModel _category = new();

        [Inject]
        ICategoryHttpRepository Repository { get; set; }

        [Inject]
        NavigationManager Navigation { get; set; }

        private async Task Create()
        {
            await Repository.CreateCategory(_category);
            Navigation.NavigateTo("/categories");
        }

        private void CancelUpdate()
        {
            Navigation.NavigateTo("/categories");
        }
    }
}
