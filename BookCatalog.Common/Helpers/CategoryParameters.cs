
namespace BookCatalog.Common.Helpers
{
    public class CategoryParameters : QueryStringParameters
    {
        public CategoryParameters()
        {
            OrderBy = "name";
        }

        public string Name { get; set; }

        public string OrderBy { get; set; }
    }
}
