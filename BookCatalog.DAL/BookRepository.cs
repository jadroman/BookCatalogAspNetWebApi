using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using BookCatalog.Common.Interfaces;
using LinqKit;
using Microsoft.Data.SqlClient;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
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
            var predicate = PredicateBuilder.New<Book>();

            if (!string.IsNullOrWhiteSpace(bookParameters.Title))
            {
                predicate = predicate.And(p => p.Title.Contains(bookParameters.Title));
            }

            if (!string.IsNullOrWhiteSpace(bookParameters.Author))
            {
                predicate = predicate.And(p => p.Author.Contains(bookParameters.Author));
            }

            if (!string.IsNullOrWhiteSpace(bookParameters.Note))
            {
                predicate = predicate.And(p => p.Note.Contains(bookParameters.Note));
            }

            if (!string.IsNullOrWhiteSpace(bookParameters.Category))
            {
                predicate = predicate.And(p => p.Category.Name.Contains(bookParameters.Category));
            }

            return _context.Books.Include(b => b.Category).Where(predicate).AsNoTracking();
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
