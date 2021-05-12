using BookCatalog.Contracts.Entities;
using BookCatalog.Contracts.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using System.Linq;

namespace BookCatalog.Domain.Services
{
    public class BookService : IBookService
    {
        private readonly IBookCatalogContext _context;

        public BookService(IBookCatalogContext context)
        {
            _context = context;
        }


        public Task<List<Book>> GetAllBooks()
        {
            return _context.Books.AsNoTracking().ToListAsync();
        }

        public Task<int> CountAllBooks()
        {
            return _context.Books.AsNoTracking().CountAsync();
        }


        public async Task<Book> GetBookById(int id)
        {
            var book = await _context.Books.Include(b => b.Category)
                 .AsNoTracking()
                 .FirstOrDefaultAsync(c => c.Id == id);

            return book;
        }


        public async Task<Category> GetCategoryById(int id)
        {
            var category = await _context.Categories
                 .AsNoTracking()
                 .FirstOrDefaultAsync(c => c.Id == id);

            return category;
        }

        public async Task<int> SaveBook(Book book)
        {
            if (book.Id == 0)
            {
                await _context.Books.AddAsync(book);
            }
            else
            {
                _context.Update(book);
            }

            return await _context.SaveChangesAsync();
        }

        public async Task<int> DeleteBook(Book book)
        {
            try
            {
                _context.Books.Remove(book);
                return await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return await Task.FromResult(0);
            }
        }

        public Task<List<Category>> GetAllCategories()
        {
            return _context.Categories.OrderBy(b=>b.Name).AsNoTracking().ToListAsync();
        }
    }
}
