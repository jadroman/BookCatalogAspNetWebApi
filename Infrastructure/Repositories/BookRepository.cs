using Contracts.Entities;
using Contracts.Interfraces.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Repositories
{
    public class BookRepository : RepositoryBase<Book>, IBookRepository
    {
        public BookRepository(BookCatalogContext repositoryContext)
            : base(repositoryContext)
        {
        }
    }
}
