using Newtonsoft.Json;
using System.Collections.Generic;

namespace BookCatalog.Common.BindingModels
{
    public class DeleteListBindingModel
    {
        [JsonProperty("idList")]
        public IEnumerable<int> IdList;
    }
}
