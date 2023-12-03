using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookCatalog.Common.Interfaces
{
    public interface IBookRepository
    {
        IQueryable<Book> GetBooks();
        IQueryable<Book> GetFilteredBooks(BookParameters bookParameters);
        Task<Book> GetBookById(int id, bool trackEntity = false);
        Task<int> UpdateBook();
        Task<int> InsertBook(Book book);
        Task<int> DeleteBook(Book book);
    }
}
