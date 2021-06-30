using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.HttpRepository
{
    public interface ICategoryHttpRepository
    {
        Task<PagedBindingEntity<CategoryBindingModel>> GetCategories(CategoryParameters parameters);
    }
}
