using Contracts.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure
{
    public class BookCatalogContext : DbContext
    {
        public BookCatalogContext(DbContextOptions<BookCatalogContext> options)
            : base(options)
        {
        }

        public DbSet<Book> Books { get; set; }
        public DbSet<Category> Categories { get; set; }
    }
}
