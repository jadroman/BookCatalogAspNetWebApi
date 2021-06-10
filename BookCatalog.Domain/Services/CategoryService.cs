
using BookCatalog.Common.BindingModels;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using BookCatalog.Common.Interfaces;
using BookCatalog.DAL;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using System.Linq;
using System.Reflection;
using System.Text;
using System;

namespace BookCatalog.Domain.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IBookCatalogContext _context;

        public CategoryService(IBookCatalogContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets Categories by params
        /// </summary>
        /// <param name="categoryParameters">eg. ".../category?pageNumber=1&pageSize=5&orderBy=name desc&name=na"</param>
        /// <returns></returns>
        public Task<PagedList<Category>> GetCategories(CategoryParameters categoryParameters)
        {
            var categories = _context.Categories.OrderBy(on => on.Name)
                                                    .AsNoTracking();

            // 1. Search for specific
            Search(ref categories, categoryParameters);

            // 2. Sort by params
            Sort(ref categories, categoryParameters.OrderBy);

            // 3. Do paging of the final results
            return PagedList<Category>.ToPagedList(categories, categoryParameters.PageNumber, categoryParameters.PageSize);
        }


        private void Search(ref IQueryable<Category> categories, CategoryParameters categoryParameters)
        {
            if (!categories.Any())
                return;

            if (!string.IsNullOrWhiteSpace(categoryParameters.Name))
                categories = categories.Where(o => o.Name.ToLower().Contains(categoryParameters.Name.Trim().ToLower()));
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

        public Task<List<Category>> GetAllCategories()
        {
            return _context.Categories.OrderBy(c => c.Name).AsNoTracking().ToListAsync();
        }

        public Task<int> CountAllCategories()
        {
            return _context.Categories.AsNoTracking().CountAsync();
        }

        public async Task<Category> GetCategoryById(int id)
        {
            var category = await _context.Categories
                 .AsNoTracking()
                 .FirstOrDefaultAsync(c => c.Id == id);

            return category;
        }

        public async Task<Category> GetCategoryByIdWithBooks(int id)
        {
            var category = await _context.Categories.Include(c => c.Books)
                 .AsNoTracking()
                 .FirstOrDefaultAsync(c => c.Id == id);

            return category;
        }

        public async Task<int> SaveCategory(Category category)
        {
            if (category.Id == 0)
            {
                await _context.Categories.AddAsync(category);
            }
            else
            {
                _context.Update(category);
            }

            return await _context.SaveChangesAsync();
        }


        public async Task<Result<int>> DeleteCategory(Category category)
        {
            if (category.Books != null && category.Books.Any())
            {
                return new InvalidResult<int>("There are some books related with this category.");
            }

            _context.Categories.Remove(category);

            return new SuccessResult<int>(await _context.SaveChangesAsync());
        }
    }
}
