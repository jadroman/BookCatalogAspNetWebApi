using System;
using System.Collections.Generic;
using System.Text;

namespace Contracts.DTOs
{
    public class BookDTO
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public CategoryDTO Category { get; set; }
    }
}
