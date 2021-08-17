using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Helpers;
using System.Collections.Generic;
using Microsoft.AspNetCore.WebUtilities;
using System.Net.Http;
using System.Threading.Tasks;
using BookCatalog.Common.BindingModels.Category;
using System.Text;
using System.IO;
using Newtonsoft.Json;
using BookCatalog.WebBlz.Services.Interfaces;

namespace BookCatalog.WebBlz.Services
{
    public class CategoryHttpRepository : ICategoryHttpRepository
    {
        private readonly HttpClient _client;

        public CategoryHttpRepository(HttpClient client)
        {
            _client = client;
        }

        public async Task<PagedBindingEntity<CategoryBindingModel>> GetCategories(CategoryParameters parameters)
        {
            var queryStringParam = new Dictionary<string, string>
            {
                ["pageNumber"] = parameters.PageNumber.ToString(),
                ["Name"] = parameters.Name ?? ""
            };

            var response = await _client.GetAsync(QueryHelpers.AddQueryString("category", queryStringParam));
            var content = await response.Content.ReadAsStringAsync();

            var categories = JsonConvert.DeserializeObject<PagedBindingEntity<CategoryBindingModel>>(content);
            return categories;
        }

        public async Task CreateCategory(CategoryEditBindingModel category)
        {
            var content = System.Text.Json.JsonSerializer.Serialize(category);
            var bodyContent = new StringContent(content, Encoding.UTF8, "application/json");

            var postResult = await _client.PostAsync("category", bodyContent);
            await postResult.Content.ReadAsStringAsync();
        }
        public async Task<CategoryEditBindingModel> GetCategory(int id)
        {
            var url = Path.Combine("category", id.ToString());

            var response = await _client.GetAsync(url);

            var content = await response.Content.ReadAsStringAsync();

            var category = JsonConvert.DeserializeObject<CategoryEditBindingModel>(content);
            return category;
        }

        public async Task UpdateCategory(CategoryEditBindingModel category)
        {
            var content = System.Text.Json.JsonSerializer.Serialize(category);
            var bodyContent = new StringContent(content, Encoding.UTF8, "application/json");
            var url = Path.Combine("category", category.Id.ToString());

            var putResult = await _client.PutAsync(url, bodyContent);
            await putResult.Content.ReadAsStringAsync();
        }

        public async Task DeleteCategory(int id)
        {
            var url = Path.Combine("category", id.ToString());

            var deleteResult = await _client.DeleteAsync(url);
            await deleteResult.Content.ReadAsStringAsync();
        }
    }
}
