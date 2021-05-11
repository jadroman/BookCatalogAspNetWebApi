using BookCatalog.Contracts.BindingModels.Book;
using BookCatalog.Contracts.Entities;
using BookCatalog.Contracts.Helpers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookCatalog.Contracts.Interfaces
{
    public interface IBookService
    {
        Task<List<Book>> GetAllBooks();
        Task<Book> GetBookById(int id);
        Task<int> SaveBook(BookBindingModel book);
        Task<int> DeleteBook(Book book);
        Task<List<Category>> GetAllCategories();
    }
}
