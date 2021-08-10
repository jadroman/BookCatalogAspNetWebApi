using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.BindingModels.Category;
using BookCatalog.WebBlz.Helpers;
using BookCatalog.WebBlz.HttpRepository;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Pages.Book
{
    public partial class BookCreate
    {
        readonly BookEditBindingModel _book = new();
        List<CategoryBindingModel> _categories = new();
        
        [Inject]
        IBookHttpRepository Repository { get; set; }

        [Inject]
        NavigationManager Navigation { get; set; }

        protected async override Task OnInitializedAsync()
        {
            await GetCategories();
            _book.Read = BooleanString.False;
        }

        private async Task Create()
        {
            await Repository.CreateBook(_book);
            Navigation.NavigateTo("/book");
        }

        private void CancelUpdate()
        {
            Navigation.NavigateTo("/book");
        }

        private async Task GetCategories()
        {
            var response = await Repository.GetCategories();
            _categories = response.Items.ToList();
        }

        private void CategoryChanged(int? selected)
        {
            _book.CategoryId = selected; 
        }
    }
}
