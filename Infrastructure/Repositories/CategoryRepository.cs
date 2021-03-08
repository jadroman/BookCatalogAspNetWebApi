using Contracts.Entities;
using Contracts.Interfraces.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Infrastructure.Repositories
{
    public class CategoryRepository : RepositoryBase<Category>, ICategoryRepository
    {
        public CategoryRepository(BookCatalogContext repositoryContext)
            : base(repositoryContext)
        {

        }

        public IEnumerable<Category> GetAllCategories()
        {
            return FindAll().ToList();
        }


        public Category GetCategoryById(long catId)
        {
            return FindByCondition(b => b.Id.Equals(catId))
                .FirstOrDefault();
        }
    }
}
