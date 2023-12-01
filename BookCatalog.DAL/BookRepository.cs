using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using BookCatalog.Common.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
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



            var pTitle = new SqlParameter("@title", System.Data.SqlDbType.VarChar);
            var pAuthor = new SqlParameter("@author", System.Data.SqlDbType.VarChar);
            var pNote = new SqlParameter("@note", System.Data.SqlDbType.VarChar);
            var pCategory = new SqlParameter("@category", System.Data.SqlDbType.VarChar);

            var paramsList = new List<SqlParameter>();

            if (!string.IsNullOrWhiteSpace(bookParameters.Title))
            {
                pTitle.Value = bookParameters.Title;
                sqlWhere = $"((@title LIKE N'') OR (CHARINDEX(@title, LOWER([b].[Title])) > 0))";
                paramsList.Add(pTitle);
            }

            if (!string.IsNullOrWhiteSpace(bookParameters.Author))
            {
                pAuthor.Value = bookParameters.Author;
                sqlWhere += (!string.IsNullOrWhiteSpace(sqlWhere)) ? " AND " : "" ;
                sqlWhere += $"((@author LIKE N'') OR (CHARINDEX(@author, LOWER([b].[Author])) > 0))";
                paramsList.Add(pAuthor);
            }

            if (!string.IsNullOrWhiteSpace(bookParameters.Note))
            {
                pNote.Value = bookParameters.Note;
                sqlWhere += (!string.IsNullOrWhiteSpace(sqlWhere)) ? " AND " : "";
                sqlWhere += $"((@note LIKE N'') OR (CHARINDEX(@note, LOWER([b].[Note])) > 0))";
                paramsList.Add(pNote);
            }

            if (!string.IsNullOrWhiteSpace(bookParameters.Category))
            {
                pCategory.Value = bookParameters.Category;
                sqlWhere += (!string.IsNullOrWhiteSpace(sqlWhere)) ? " AND " : "";
                sqlWhere += $"((@category LIKE N'') OR (CHARINDEX(@category, LOWER([c].[Name])) > 0))";
                paramsList.Add(pCategory);
            }

            return _context.Books.FromSqlRaw(sqlSelect + sqlWhere, paramsList.ToArray()).Include(b => b.Category).AsNoTracking();
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
