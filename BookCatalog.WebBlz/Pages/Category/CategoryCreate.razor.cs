using BookCatalog.Common.BindingModels.Category;
using BookCatalog.WebBlz.Services;
using BookCatalog.WebBlz.Services.Interfaces;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Pages.Category
{
    public partial class CategoryCreate : IDisposable
    {
        CategoryEditBindingModel _category = new();

        [Inject]
        ICategoryHttpRepository Repository { get; set; }

        [Inject]
        NavigationManager Navigation { get; set; }

        [Inject]
        public HttpInterceptorService Interceptor { get; set; }


        protected override void OnInitialized()
        {
            Interceptor.RegisterEvent();
        }

        private async Task Create()
        {
            await Repository.CreateCategory(_category);
            Navigation.NavigateTo("/category");
        }

        private void CancelUpdate()
        {
            Navigation.NavigateTo("/category");
        }

        public void Dispose() => Interceptor.DisposeEvent();
    }
}
