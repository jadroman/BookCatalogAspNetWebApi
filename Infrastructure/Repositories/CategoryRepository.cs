using Contracts.Entities;
using Contracts.Interfraces.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repositories
{
    public class CategoryRepository : RepositoryBase<Category>, ICategoryRepository
    {
        public CategoryRepository(BookCatalogContext repositoryContext)
            : base(repositoryContext)
        {
        }
    }
}
