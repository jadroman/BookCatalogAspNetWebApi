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

namespace BookCatalog.WebBlz.Pages
{
    public partial class Categories
    {
        public PagedBindingEntity<CategoryBindingModel> Response { get; set; }
        public PagingMetaData MetaData { get; set; } = new PagingMetaData();
        public List<CategoryBindingModel> CategoryList { get; set; } = new();
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
            CategoryList=Response.Items.ToList();
            MetaData = Response.MetaData;
        }

        private async Task SelectedPage(int page)
        {
            _categoryParameters.PageNumber = page;
            await GetCategories();
        }
    }
}
