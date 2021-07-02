using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using BookCatalog.WebBlz.HttpRepository;
using BookCatalog.WebBlz.Shared;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Pages.Category
{
    public partial class CategoryList
    {
        public bool IsLoading { get; set; } = true;
        public PagedBindingEntity<CategoryBindingModel> Response { get; set; }
        public PagingMetaData MetaData { get; set; } = new PagingMetaData();
        public List<CategoryBindingModel> CategList { get; set; } = new();
        private CategoryParameters _categoryParameters = new();
        private YesNoModal _yesNoModal;

        [Inject]
        public NavigationManager Navigation { get; set; }


        [Inject]
        public ICategoryHttpRepository CategoryRepo { get; set; }

        protected async override Task OnInitializedAsync()
        {
            await GetCategories();
        }

        private void DeleteCategory(int id)
        {
            _yesNoModal.Show($@"Are you sure you want to delete ""{GetCategoryNameById(id)}"" category?", id);
        }

        private string GetCategoryNameById(int id)
        {
            string catName = "";
            if (CategList != null && CategList.Count > 1)
            {
                catName = CategList.Where(c => c.Id == id).FirstOrDefault().Name;
            }
            return catName;
        }

        public async Task CategoryDeletionConfirmed(object id)
        {
            //Console.WriteLine($"CategoryDeletionConfirmed: {entityId}");
            await CategoryRepo.DeleteCategory(Convert.ToInt32(id));
            //_categoryParameters.PageNumber = 1;
            await GetCategories();
        }

        public void CategoryDeletionRejected()
        {
            Console.WriteLine($"CategoryDeletionRejected");
        }

        private async Task GetCategories()
        {
            Response = await CategoryRepo.GetCategories(_categoryParameters);
            IsLoading = false;
            CategList = Response.Items.ToList();
            MetaData = Response.MetaData;
        }

        private async Task SelectedPage(int page)
        {
            _categoryParameters.PageNumber = page;
            await GetCategories();
        }
        private async Task SearchChanged(string searchTerm)
        {
            _categoryParameters.PageNumber = 0;
            _categoryParameters.Name = searchTerm;
            await GetCategories();
        }
    }
}
