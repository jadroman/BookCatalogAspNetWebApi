using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalogAPI.Models
{
    public class Book
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public Category Category { get; set; }
    }
}
