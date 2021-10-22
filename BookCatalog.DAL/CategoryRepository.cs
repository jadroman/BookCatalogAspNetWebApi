using BookCatalog.Common.Entities;
using BookCatalog.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.DAL
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly IBookCatalogContext _context;

        public CategoryRepository(IBookCatalogContext context)
        {
            _context = context;
        }

        public IQueryable<Category> GetCategories()
        {
            return _context.Categories.AsNoTracking(); 
        }

        public IQueryable<Category> GetCategoriesByName(string categoryName)
        {
            return _context.Categories.Where(o => o.Name.ToLower().Contains(categoryName)).AsNoTracking();
        }

        public async Task<Category> GetCategoryById(int id, bool trackEntity = false)
        {
            Category category;

            if (trackEntity)
            {
                category = await _context.Categories
                     .FirstOrDefaultAsync(c => c.Id == id);
            }
            else
            {
                category = await _context.Categories
                     .AsNoTracking()
                     .FirstOrDefaultAsync(c => c.Id == id);
            }

            return category;
        }

        public async Task<Category> GetCategoryByIdWithBooks(int id)
        {
            var category = await _context.Categories.Include(c => c.Books)
                 .AsNoTracking()
                 .FirstOrDefaultAsync(c => c.Id == id);

            return category;
        }

        public async Task<int> UpdateCategory()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task<int> InsertCategory(Category category)
        {
            await _context.Categories.AddAsync(category);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> DeleteCategory(Category category)
        {
            _context.Categories.Remove(category);
            return await _context.SaveChangesAsync();
        }
    }
}
