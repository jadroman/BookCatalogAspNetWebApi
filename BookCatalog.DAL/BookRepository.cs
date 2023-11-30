using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
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
            return _context.Books.Include(b => b.Category).AsNoTracking(); 
        }

        public IQueryable<Book> GetBooksByTitle(string bookTitle)
        {
            return _context.Books.Include(b => b.Category).Where(o => o.Title.ToLower().Contains(bookTitle)).AsNoTracking();
        }

        public IQueryable<Book> GetBooksByAuthor(string bookAuthor)
        {
            return _context.Books.Include(b => b.Category).Where(o => o.Author.ToLower().Contains(bookAuthor)).AsNoTracking();
        }

        public IQueryable<Book> GetBooksByNote(string bookNote)
        {
            return _context.Books.Include(b => b.Category).Where(o => o.Note.ToLower().Contains(bookNote)).AsNoTracking();
        }

        public IQueryable<Book> GetBooksByCategory(string categoryName)
        {
            return _context.Books.Include(b => b.Category).Where(b => b.Category.Name.ToLower().Contains(categoryName)).AsNoTracking();
        }

        public IQueryable<Book> GetFilteredBooks(BookParameters bookParameters)
        {
            string sqlSelect = @"
                                SELECT 
                                    [b].[Id], [b].[Author], [b].[CategoryId], [b].[Collection], 
                                    [b].[Note], [b].[Publisher], [b].[Read], [b].[Title], 
                                    [b].[Year]
                                FROM [Book] AS [b]
                                LEFT JOIN [Category] AS [c] ON [b].[CategoryId] = [c].[Id]
                                WHERE 
            ";

            string sqlWhere = string.Empty;

            if (!string.IsNullOrWhiteSpace(bookParameters.Title))
                sqlWhere = $"((N'{bookParameters.Title}' LIKE N'') OR (CHARINDEX(N'{bookParameters.Title}', LOWER([b].[Title])) > 0))";

            if (!string.IsNullOrWhiteSpace(bookParameters.Author))
            {
                sqlWhere += (!string.IsNullOrWhiteSpace(sqlWhere)) ? " AND " : "" ;
                sqlWhere += $"((N'{bookParameters.Author}' LIKE N'') OR (CHARINDEX(N'{bookParameters.Author}', LOWER([b].[Author])) > 0))";
            }

            if (!string.IsNullOrWhiteSpace(bookParameters.Note))
            {
                sqlWhere += (!string.IsNullOrWhiteSpace(sqlWhere)) ? " AND " : "";
                sqlWhere += $"((N'{bookParameters.Note}' LIKE N'') OR (CHARINDEX(N'{bookParameters.Note}', LOWER([b].[Note])) > 0))";
            }

            if (!string.IsNullOrWhiteSpace(bookParameters.Category))
            {
                sqlWhere += (!string.IsNullOrWhiteSpace(sqlWhere)) ? " AND " : "";
                sqlWhere += $"((N'{bookParameters.Category}' LIKE N'') OR (CHARINDEX(N'{bookParameters.Category}', LOWER([c].[Name])) > 0))";
            }

            return _context.Books.FromSqlRaw(sqlSelect + sqlWhere).Include(b => b.Category).AsNoTracking();
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
