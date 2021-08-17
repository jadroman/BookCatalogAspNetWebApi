using BookCatalog.Common.BindingModels.Category;
using BookCatalog.WebBlz.Services;
using BookCatalog.WebBlz.Services.Interfaces;
using Microsoft.AspNetCore.Components;
using System;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Pages.Category
{
    public partial class CategoryUpdate : IDisposable
    {
        CategoryEditBindingModel _category;

        [Inject]
        ICategoryHttpRepository CategoryRepo { get; set; }

        [Inject]
        NavigationManager Navigation { get; set; }

        [Parameter]
        public string Id { get; set; }

        [Inject]
        public HttpInterceptorService Interceptor { get; set; }

        protected async override Task OnInitializedAsync()
        {
            Interceptor.RegisterEvent();
            _category = await CategoryRepo.GetCategory(Convert.ToInt32(Id));
        }

        private async Task Update()
        {
            await CategoryRepo.UpdateCategory(_category);
            Navigation.NavigateTo("/category");
        }

        private void CancelUpdate()
        {
            Navigation.NavigateTo("/category");
        }

        public void Dispose() => Interceptor.DisposeEvent();
    }
}
