using BookCatalog.Common.Entities;
using BookCatalog.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
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

        public async Task<int> UpdateCategory()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task InsertCategory(Category category)
        {
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
        }
    }
}
