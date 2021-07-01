using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.WebUtilities;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using BookCatalog.Common.BindingModels.Category;
using System.Text;

namespace BookCatalog.WebBlz.HttpRepository
{
    public class CategoryHttpRepository : ICategoryHttpRepository
    {
        private readonly HttpClient _client;
        private readonly JsonSerializerOptions _options;

        public CategoryHttpRepository(HttpClient client)
        {
            _client = client;
            _options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
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

            if (!response.IsSuccessStatusCode)
            {
                throw new ApplicationException(content);
            }

            //var categories = JsonSerializer.Deserialize<List<Category>>(content, _options);
            var categories = JsonSerializer.Deserialize<PagedBindingEntity<CategoryBindingModel>>(content, _options);
            return categories;
        }

        public async Task CreateCategory(CategoryEditBindingModel category)
        {
            var content = JsonSerializer.Serialize(category);
            var bodyContent = new StringContent(content, Encoding.UTF8, "application/json");

            var postResult = await _client.PostAsync("category", bodyContent);
            var postContent = await postResult.Content.ReadAsStringAsync();

            if (!postResult.IsSuccessStatusCode)
            {
                throw new ApplicationException(postContent);
            }
        }
    }
}
