using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.BindingModels.Category;
using BookCatalog.WebBlz.HttpRepository;
using BookCatalog.WebBlz.Shared;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Pages.Category
{
    public partial class CategoryUpdate
    {
        private CategoryEditBindingModel _category;

        [Inject]
        ICategoryHttpRepository CategoryRepo { get; set; }

        [Inject]
        public NavigationManager Navigation { get; set; }

        [Parameter]
        public string Id { get; set; }

        protected async override Task OnInitializedAsync()
        {
            _category = await CategoryRepo.GetCategory(Convert.ToInt32(Id));
        }

        private async Task Update()
        {
            await CategoryRepo.UpdateCategory(_category);
            Navigation.NavigateTo("/categories");
        }
    }
}
