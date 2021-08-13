using BookCatalog.Common.BindingModels.Book;
using BookCatalog.WebBlz.HttpRepository;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Pages.Book
{
    public partial class BookUpdate : IDisposable
    {
        BookEditBindingModel _book;
        List<CategoryBindingModel> _categories = new();

        [Inject]
        IBookHttpRepository Repository { get; set; }

        [Inject]
        NavigationManager Navigation { get; set; }

        [Inject]
        public HttpInterceptorService Interceptor { get; set; }

        [Parameter]
        public string Id { get; set; }

        protected async override Task OnInitializedAsync()
        {
            Interceptor.RegisterEvent();
            _book = await Repository.GetBook(Convert.ToInt32(Id));
            await GetCategories();
        }

        private async Task Update()
        {
            await Repository.UpdateBook(_book);
            Navigation.NavigateTo("/book");
        }

        private void CancelUpdate()
        {
            Navigation.NavigateTo("/book");
        }

        private async Task GetCategories()
        {
            var response = await Repository.GetCategories();
            _categories = response?.Items?.ToList();
        }

        private void CategoryChanged(int? selected)
        {
            _book.CategoryId = selected;
        }

        public void Dispose() => Interceptor.DisposeEvent();
    }
}
