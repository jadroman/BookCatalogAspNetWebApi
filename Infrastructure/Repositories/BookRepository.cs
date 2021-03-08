using Contracts.Entities;
using Contracts.Interfraces.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Infrastructure.Repositories
{
    public class BookRepository : RepositoryBase<Book>, IBookRepository
    {
        public BookRepository(BookCatalogContext repositoryContext)
            : base(repositoryContext)
        {
        }

        public IEnumerable<Book> GetAllBooks()
        {
            return FindAll().ToList();
        }

        public Book GetBookById(long bookId)
        {
            return FindByCondition(b => b.Id.Equals(bookId))
                .FirstOrDefault();
        }
    }
}
