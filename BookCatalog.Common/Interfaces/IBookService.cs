using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookCatalog.Common.Interfaces
{
    public interface IBookService
    {
        Task<PagedList<Book>> GetBooks(BookParameters bookParameters);
        Task<Book> GetBookById(int id, bool trackEntity = false);
        Task<int> SaveBook(Book book);
        Task<int> DeleteBook(Book book);
        Task<List<Category>> GetAllCategories();
        Task<Category> GetCategoryById(int id);
    }
}
