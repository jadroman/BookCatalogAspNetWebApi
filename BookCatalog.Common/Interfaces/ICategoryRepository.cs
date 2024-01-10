using BookCatalog.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookCatalog.Common.Interfaces
{
    public interface ICategoryRepository
    {
        IQueryable<Category> GetCategories();
        IQueryable<Category> GetCategoriesByName(string categoryName);
        Task<Category> GetCategoryById(int id, bool trackEntity = false);
        Task<Category> GetCategoryByIdWithBooks(int id);
        Task<int> UpdateCategory();
        Task<int> InsertCategory(Category category);
        Task<int> DeleteCategory(Category category);
        Task<int> DeleteCategoryList(IEnumerable<Category> categoryList);
        IQueryable<Category> GetCategoryListByIds(IEnumerable<int> idList);
    }
}
