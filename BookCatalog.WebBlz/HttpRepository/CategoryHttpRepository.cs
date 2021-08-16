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
using System.IO;
using Microsoft.AspNetCore.Components.Authorization;
using Blazored.LocalStorage;
using Newtonsoft.Json;
using BookCatalog.WebBlz.Auth;

namespace BookCatalog.WebBlz.HttpRepository
{
    public class CategoryHttpRepository : ICategoryHttpRepository
    {
        private readonly HttpClient _client;
        private readonly JsonSerializerOptions _options;
        private readonly AuthenticationStateProvider _authStateProvider;
        private readonly ILocalStorageService _localStorage;

        public CategoryHttpRepository(HttpClient client, AuthenticationStateProvider authStateProvider, ILocalStorageService localStorage)
        {
            _client = client;
            _options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            _authStateProvider = authStateProvider;
            _localStorage = localStorage;
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

            //var categories = JsonSerializer.Deserialize<PagedBindingEntity<CategoryBindingModel>>(content, _options);
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

            //var category = JsonSerializer.Deserialize<CategoryEditBindingModel>(content, _options);
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
