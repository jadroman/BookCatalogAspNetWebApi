using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookCatalog.Common.Helpers
{
    public class BookParameters : QueryStringParameters
    {
        public BookParameters()
        {
            OrderBy = "title";
        }

        public uint MinYear { get; set; }
        public uint MaxYear { get; set; } 
        public bool ValidYearRange => MaxYear > MinYear;
        public string Title { get; set; }
        public string Note { get; set; }
        public string Author { get; set; }
        public string Category { get; set; }

        public string OrderBy { get; set; }
    }
}
