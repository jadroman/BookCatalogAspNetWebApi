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
        Task<int> SaveBook(Book book);
        Task<int> DeleteBook(Book book);
        Task<List<Category>> GetAllCategories();
        Task<Category> GetCategoryById(int id);
    }
}
