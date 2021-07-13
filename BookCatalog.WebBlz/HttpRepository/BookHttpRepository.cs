using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.WebUtilities;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text;
using System.IO;
using Newtonsoft.Json;
using BookCatalog.WebBlz.Helpers;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Authorization;
using Blazored.LocalStorage;
using BookCatalog.WebBlz.Auth;

namespace BookCatalog.WebBlz.HttpRepository
{
    public class BookHttpRepository : IBookHttpRepository
    {
        private readonly HttpClient _client;
        private readonly AuthenticationStateProvider _authStateProvider;
        private readonly ILocalStorageService _localStorage;
        private readonly NavigationManager _navMagager;

        public BookHttpRepository(HttpClient client, AuthenticationStateProvider authStateProvider, ILocalStorageService localStorage, NavigationManager navManager)
        {
            _client = client;
            _authStateProvider = authStateProvider;
            _localStorage = localStorage;
            _navMagager = navManager;
        }

        public async Task<PagedBindingEntity<BookBindingModel>> GetBooks(BookParameters parameters)
        {
            var queryStringParam = new Dictionary<string, string>
            {
                ["pageNumber"] = parameters.PageNumber.ToString(),
                ["Title"] = parameters.Title ?? "",
                ["Author"] = parameters.Author ?? "",
                ["Note"] = parameters.Note ?? ""
            };

            var response = await _client.GetAsync(QueryHelpers.AddQueryString("book", queryStringParam));
            var content = await response.Content.ReadAsStringAsync();

            if(response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                await _localStorage.RemoveItemAsync("authToken");
                ((AuthStateProvider)_authStateProvider).NotifyUserLogout();
                _client.DefaultRequestHeaders.Authorization = null;
            }

            var books = JsonConvert.DeserializeObject<PagedBindingEntity<BookBindingModel>>(content);

            return books;
        }

        public async Task CreateBook(BookEditBindingModel book)
        {
            var content = System.Text.Json.JsonSerializer.Serialize(book);
            var bodyContent = new StringContent(content, Encoding.UTF8, "application/json");

            var postResult = await _client.PostAsync("book", bodyContent);
            var postContent = await postResult.Content.ReadAsStringAsync();

            if (!postResult.IsSuccessStatusCode)
            {
                throw new ApplicationException(postContent);
            }
        }
        public async Task<BookEditBindingModel> GetBook(int id)
        {
            var url = Path.Combine("book", id.ToString());

            var response = await _client.GetAsync(url);

            var content = await response.Content.ReadAsStringAsync();
            if (!response.IsSuccessStatusCode)
            {
                throw new ApplicationException(content);
            }

            var book = JsonConvert.DeserializeObject<BookEditBindingModel>(content);

            return book;
        }

        public async Task UpdateBook(BookEditBindingModel book)
        {
            var content = System.Text.Json.JsonSerializer.Serialize(book);
            var bodyContent = new StringContent(content, Encoding.UTF8, "application/json");
            var url = Path.Combine("book", book.Id.ToString());

            var putResult = await _client.PutAsync(url, bodyContent);
            var putContent = await putResult.Content.ReadAsStringAsync();

            if (!putResult.IsSuccessStatusCode)
            {
                throw new ApplicationException(putContent);
            }
        }

        public async Task DeleteBook(int id)
        {
            var url = Path.Combine("book", id.ToString());

            var deleteResult = await _client.DeleteAsync(url);
            var deleteContent = await deleteResult.Content.ReadAsStringAsync();

            if (!deleteResult.IsSuccessStatusCode)
            {
                throw new ApplicationException(deleteContent);
            }
        }

        public async Task<PagedBindingEntity<CategoryBindingModel>> GetCategories()
        {

            var response = await _client.GetAsync("category");
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new ApplicationException(content);
            }

            var categories = JsonConvert.DeserializeObject<PagedBindingEntity<CategoryBindingModel>>(content);
            return categories;
        }
    }
}
