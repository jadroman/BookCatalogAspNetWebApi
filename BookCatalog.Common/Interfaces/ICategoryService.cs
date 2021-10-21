using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.BindingModels.Category;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookCatalog.Common.Interfaces
{
    public interface ICategoryService
    {
        Task<CategoryBindingModel> GetCategoryById(int id, bool trackEntity = false);
        Task<int> UpdateCategory(CategoryEditBindingModel category, int id);
        Task InsertCategory(CategoryEditBindingModel category);
        Task<Result<int>> DeleteCategory(Category category);
        Task<Category> GetCategoryByIdWithBooks(int id);
        Task<PagedList<Category>> GetCategories(CategoryParameters categoryParameters);
    }
}
