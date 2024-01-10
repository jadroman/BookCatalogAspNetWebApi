using BookCatalog.Common.BindingModels;
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
        Task<int> InsertCategory(CategoryEditBindingModel category);
        Task<Result<int>> DeleteCategory(int id);
        Task<Result<int>> DeleteCategoryList(IEnumerable<int> idList);
        Task<PagedBindingEntity<CategoryBindingModel>> GetCategories(CategoryParameters categoryParameters);
    }
}
