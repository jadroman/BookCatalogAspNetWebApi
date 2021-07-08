using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.BindingModels.Category;
using BookCatalog.WebBlz.HttpRepository;
using BookCatalog.WebBlz.Shared;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Pages.Book
{
    public partial class BookUpdate
    {
        string trueRead = "true";
        string falseRead = "false";
        BookEditBindingModel _book;
        List<CategoryBindingModel> _categories = new();

        [Inject]
        IBookHttpRepository Repository { get; set; }

        [Inject]
        NavigationManager Navigation { get; set; }

        [Parameter]
        public string Id { get; set; }

        protected async override Task OnInitializedAsync()
        {
            _book = await Repository.GetBook(Convert.ToInt32(Id));
            await GetCategories();
        }

        private async Task Update()
        {
            await Repository.UpdateBook(_book);
            Navigation.NavigateTo("/books");
        }

        private void CancelUpdate()
        {
            Navigation.NavigateTo("/books");
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
