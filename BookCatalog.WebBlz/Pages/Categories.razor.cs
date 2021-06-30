using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Entities;
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
        public List<CategoryBindingModel> CategoryList = new();
        public PagedBindingEntity<CategoryBindingModel> Response { get; set; }


        [Inject]
        public ICategoryHttpRepository CategoryRepo { get; set; }

        protected async override Task OnInitializedAsync()
        {
            Response = await CategoryRepo.GetCategories();
            CategoryList.AddRange(Response.Items);

        }
    }
}
