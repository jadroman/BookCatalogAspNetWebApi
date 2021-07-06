using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.BindingModels.Category;
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
        BookEditBindingModel _book = new();

        [Inject]
        IBookHttpRepository Repository { get; set; }

        [Inject]
        NavigationManager Navigation { get; set; }

        private async Task Create()
        {
            await Repository.CreateBook(_book);
            Navigation.NavigateTo("/book");
        }

        private void CancelUpdate()
        {
            Navigation.NavigateTo("/books");
        }
    }
}
