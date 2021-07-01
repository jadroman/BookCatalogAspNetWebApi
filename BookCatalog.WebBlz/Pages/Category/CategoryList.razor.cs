using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using BookCatalog.WebBlz.HttpRepository;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Pages.Category
{
    public partial class CategoryList
    {
        public PagedBindingEntity<CategoryBindingModel> Response { get; set; }
        public PagingMetaData MetaData { get; set; } = new PagingMetaData();
        public List<CategoryBindingModel> CategList { get; set; } = new();
        private CategoryParameters _categoryParameters = new(); 

        [Inject]
        public ICategoryHttpRepository CategoryRepo { get; set; }

        protected async override Task OnInitializedAsync()
        {
            await GetCategories();
        }


        private async Task GetCategories()
        {
            Response = await CategoryRepo.GetCategories(_categoryParameters);
            CategList=Response.Items.ToList();
            MetaData = Response.MetaData;
        }

        private async Task SelectedPage(int page)
        {
            _categoryParameters.PageNumber = page;
            await GetCategories();
        }
        private async Task SearchChanged(string searchTerm)
        {
            Console.WriteLine(searchTerm);
            _categoryParameters.PageNumber = 0;
            _categoryParameters.Name = searchTerm;
            await GetCategories();
        }
    }
}
