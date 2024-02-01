using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Helpers;
using System.Collections.Generic;
using Microsoft.AspNetCore.WebUtilities;
using System.Net.Http;
using System.Threading.Tasks;
using System.Text;
using System.IO;
using Newtonsoft.Json;
using BookCatalog.WebBlz.Services.Interfaces;

namespace BookCatalog.WebBlz.Services
{
    public class BookHttpRepository : IBookHttpRepository
    {
        private readonly HttpClient _client;

        public BookHttpRepository(HttpClient client)
        {
            _client = client;
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
            var books = JsonConvert.DeserializeObject<PagedBindingEntity<BookBindingModel>>(content);

            return books;
        }

        public async Task CreateBook(BookEditBindingModel book)
        {
            var content = System.Text.Json.JsonSerializer.Serialize(book);
            var bodyContent = new StringContent(content, Encoding.UTF8, "application/json");

            await _client.PostAsync("book", bodyContent);
        }
        public async Task<BookEditBindingModel> GetBook(int id)
        {
            var url = Path.Combine("book", id.ToString());

            var response = await _client.GetAsync(url);

            var content = await response.Content.ReadAsStringAsync();
            var book = JsonConvert.DeserializeObject<BookEditBindingModel>(content);

            return book;
        }

        public async Task UpdateBook(BookEditBindingModel book)
        {
            var content = System.Text.Json.JsonSerializer.Serialize(book);
            var bodyContent = new StringContent(content, Encoding.UTF8, "application/json");
            var url = Path.Combine("book", book.Id.ToString());

            await _client.PostAsync(url, bodyContent);
        }

        public async Task DeleteBook(int id)
        {
            var bodyContent = new StringContent("{ id: " + id.ToString() + " }", Encoding.UTF8, "application/json");

            await _client.PostAsync("book/Delete", bodyContent);
        }

        public async Task<PagedBindingEntity<CategoryBindingModel>> GetCategories()
        {

            var response = await _client.GetAsync("category");
            var content = await response.Content.ReadAsStringAsync();
            var categories = JsonConvert.DeserializeObject<PagedBindingEntity<CategoryBindingModel>>(content);
            return categories;
        }
    }
}
