using BookCatalog.Common.Entities;
using BookCatalog.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.DAL
{
    public class BookRepository : IBookRepository
    {
        private readonly IBookCatalogContext _context;

        public BookRepository(IBookCatalogContext context)
        {
            _context = context;
        }

        public IQueryable<Book> GetBooks()
        {
            return _context.Books.AsNoTracking(); 
        }

        public IQueryable<Book> GetBooksByTitle(string bookTitle)
        {
            return _context.Books.Where(o => o.Title.ToLower().Contains(bookTitle)).AsNoTracking();
        }

        public IQueryable<Book> GetBooksByAuthor(string bookAuthor)
        {
            return _context.Books.Where(o => o.Author.ToLower().Contains(bookAuthor)).AsNoTracking();
        }

        public IQueryable<Book> GetBooksByNote(string bookNote)
        {
            return _context.Books.Where(o => o.Note.ToLower().Contains(bookNote)).AsNoTracking();
        }

        public IQueryable<Book> GetBooksByCategory(string categoryName)
        {
            return _context.Books.Include(b => b.Category).Where(b => b.Category.Name == categoryName).AsNoTracking();
        }

        public async Task<Book> GetBookById(int id, bool trackEntity = false)
        {
            Book book;

            if (trackEntity)
            {
                book = await _context.Books.Include(b => b.Category)
                     .FirstOrDefaultAsync(c => c.Id == id);
            }
            else
            {
                book = await _context.Books.Include(b => b.Category)
                     .AsNoTracking()
                     .FirstOrDefaultAsync(c => c.Id == id);
            }

            return book;
        }

        public async Task<int> UpdateBook()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task<int> InsertBook(Book book)
        {
            await _context.Books.AddAsync(book);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> DeleteBook(Book book)
        {
            _context.Books.Remove(book);
            return await _context.SaveChangesAsync();
        }
    }
}
