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
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public bool HasPrevious { get; set; }
        public bool HasNext { get; set; }
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
            CurrentPage = Response.CurrentPage;
            TotalPages = Response.TotalPages;
            PageSize = Response.PageSize;
            TotalCount = Response.TotalCount;
            HasPrevious = Response.HasPrevious;
            HasNext = Response.HasNext;
        }

        private async Task SelectedPage(int page)
        {
            _categoryParameters.PageNumber = page;
            await GetCategories();
        }
    }
}
