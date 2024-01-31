using Newtonsoft.Json;

namespace BookCatalog.Common.BindingModels
{
    public class DeleteBindingModel
    {
        [JsonProperty("id")]
        public int Id;
    }
}
