using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalogAPI.Models
{
    public class SeedData
    {
        public static void SeedDatabase(BookCatalogContext context)
        {
            context.Database.Migrate();
            if (context.Books.Count() == 0 && context.Categories.Count() == 0)
            {
                Category ct1 = new Category { Name = "SF" };
                Category ct2 = new Category { Name = "Classics" };
                Category ct3 = new Category { Name = "Fantasy" };

                context.Books.AddRange(
                    new Book
                    {
                        Category = ct1,
                        Title = "I robot"
                    },
                    new Book
                    {
                        Category = ct2,
                        Title = "Emma"
                    },
                    new Book
                    {
                        Category = ct3,
                        Title = "LOR"
                    });

                context.SaveChanges();
            }
        }
    }
}
