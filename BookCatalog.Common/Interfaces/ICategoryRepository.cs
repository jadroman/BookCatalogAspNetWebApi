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
        Task<Category> GetCategoryById(int id, bool trackEntity = false);
        Task<int> UpdateCategory();
        Task InsertCategory(Category category);
    }
}
