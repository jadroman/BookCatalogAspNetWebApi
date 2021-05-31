using BookCatalog.Common.BindingModels.Book;
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
        Task<Category> GetCategoryById(int id);
        Task<int> SaveCategory(Category category);
        Task<Result<int>> DeleteCategory(Category category);
        Task<Category> GetCategoryByIdWithBooks(int id);
        Task<List<Category>> GetAllCategories();
    }
}
