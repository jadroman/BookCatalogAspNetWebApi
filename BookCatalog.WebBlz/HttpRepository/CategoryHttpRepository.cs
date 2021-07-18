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

            if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                await _localStorage.RemoveItemAsync("authToken");
                ((AuthStateProvider)_authStateProvider).NotifyUserLogout();
                _client.DefaultRequestHeaders.Authorization = null;
            }

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
        public async Task<CategoryEditBindingModel> GetCategory(int id)
        {
            var url = Path.Combine("category", id.ToString());

            var response = await _client.GetAsync(url);

            var content = await response.Content.ReadAsStringAsync();
            if (!response.IsSuccessStatusCode)
            {
                throw new ApplicationException(content);
            }

            var category = JsonSerializer.Deserialize<CategoryEditBindingModel>(content, _options);

            return category;
        }

        public async Task UpdateCategory(CategoryEditBindingModel category)
        {
            var content = JsonSerializer.Serialize(category);
            var bodyContent = new StringContent(content, Encoding.UTF8, "application/json");
            var url = Path.Combine("category", category.Id.ToString());

            var putResult = await _client.PutAsync(url, bodyContent);
            var putContent = await putResult.Content.ReadAsStringAsync();

            if (!putResult.IsSuccessStatusCode)
            {
                throw new ApplicationException(putContent);
            }
        }

        public async Task DeleteCategory(int id)
        {
            var url = Path.Combine("category", id.ToString());

            var deleteResult = await _client.DeleteAsync(url);
            var deleteContent = await deleteResult.Content.ReadAsStringAsync();

            if (!deleteResult.IsSuccessStatusCode)
            {
                throw new ApplicationException(deleteContent);
            }
        }
    }
}
