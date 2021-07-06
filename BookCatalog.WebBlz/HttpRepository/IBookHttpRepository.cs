using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Helpers;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.HttpRepository
{
    public interface IBookHttpRepository
    {
        Task<PagedBindingEntity<BookBindingModel>> GetBooks(BookParameters parameters); 
        Task CreateBook(BookEditBindingModel book);
        Task<BookEditBindingModel> GetBook(int id);
        Task UpdateBook(BookEditBindingModel book);
        Task DeleteBook(int id);
    }
}
