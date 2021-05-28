﻿using BookCatalog.Common.Entities;
using BookCatalog.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using System.Linq;
using BookCatalog.Common.Helpers;
using System.Reflection;
using System.Text;

namespace BookCatalog.Domain.Services
{
    public class BookService : IBookService
    {
        private readonly IBookCatalogContext _context;

        public BookService(IBookCatalogContext context)
        {
            _context = context;
        }

        public Task<PagedList<Book>> GetBooks(BookParameters bookParameters)
        {
            // 1. Filter all results
            var books = Filter(bookParameters);

            // 2. Search for specific
            Search(ref books, bookParameters);

            Sort<Book>(ref books, bookParameters.OrderBy);

            // 3. Do paging of the final results
            return PagedList<Book>.ToPagedList(books, bookParameters.PageNumber, bookParameters.PageSize);
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

        private void Search(ref IQueryable<Book> books, BookParameters bookParameters)
        {
            if (!books.Any() || string.IsNullOrWhiteSpace(bookParameters.SearchTerm))
                return;

            books = books.Where(o => o.Title.ToLower().Contains(bookParameters.SearchTerm.Trim().ToLower()) ||
                                     o.Author.ToLower().Contains(bookParameters.SearchTerm.Trim().ToLower()));
        }

        private IQueryable<Book> Filter(BookParameters bookParameters)
        {
            return _context.Books.Where(b => b.Year >= bookParameters.MinYear &&
                                                b.Year <= bookParameters.MaxYear).OrderBy(on => on.Title)
                                                    .AsNoTracking();
        }

        private void Sort<T>(ref IQueryable<T> entities, string orderByQueryString)
        {
            if (!entities.Any())
                return;

            if (string.IsNullOrWhiteSpace(orderByQueryString))
            {
                return;
            }

            var entityParams = orderByQueryString.Trim().Split(',');
            var propertyInfos = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            var entityQueryBuilder = new StringBuilder();

            foreach (var param in entityParams)
            {
                if (string.IsNullOrWhiteSpace(param))
                    continue;

                var propertyFromQueryName = param.Split(" ")[0];
                var objectProperty = propertyInfos.FirstOrDefault(pi => pi.Name.Equals(propertyFromQueryName, StringComparison.InvariantCultureIgnoreCase));

                if (objectProperty == null)
                    continue;

                var sortingOrder = param.EndsWith(" desc") ? "descending" : "ascending";

                entityQueryBuilder.Append($"{objectProperty.Name} {sortingOrder}, ");
            }

            var entityQuery = entityQueryBuilder.ToString().TrimEnd(',', ' ');

            if (string.IsNullOrWhiteSpace(entityQuery))
            {
                return;
            }

            entities = entities.OrderBy(entityQuery);
        }
    }
}
