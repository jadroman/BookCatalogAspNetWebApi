using System;
using System.Collections.Generic;
using System.Text;

namespace Contracts.DTOs
{
    public class CategoryDTO
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<BookDTO> Books { get; set; }
    }
}
