using Contracts.Entities;
using Contracts.Interfaces.Infrastructure;
using System;
using System.Collections.Generic;
using System.Text;

namespace Contracts.Interfraces.Infrastructure
{
    public interface IBookRepository : IRepositoryBase<Book>
    {
        IEnumerable<Book> GetAllBooks();
        Book GetBookById(long bookId);
    }
}
