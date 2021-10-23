using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookCatalog.Common.Interfaces
{
    public interface IBookService
    {
        Task<BookBindingModel> GetBookById(int id, bool trackEntity = false);
        Task<int> UpdateBook(BookEditBindingModel book, int id);
        Task<int> InsertBook(BookEditBindingModel book);
        Task<Result<int>> DeleteBook(int id);
        Task<PagedBindingEntity<BookBindingModel>> GetBooks(BookParameters bookParameters);
    }
}
