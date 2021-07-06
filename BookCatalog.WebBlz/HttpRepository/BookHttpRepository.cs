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
using System.Text;
using System.IO;

namespace BookCatalog.WebBlz.HttpRepository
{
    public class BookHttpRepository : IBookHttpRepository
    {
        private readonly HttpClient _client;
        private readonly JsonSerializerOptions _options;

        public BookHttpRepository(HttpClient client)
        {
            _client = client;
            _options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
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

            if (!response.IsSuccessStatusCode)
            {
                throw new ApplicationException(content);
            }

            var books = JsonSerializer.Deserialize<PagedBindingEntity<BookBindingModel>>(content, _options);
            return books;
        }

        public async Task CreateBook(BookEditBindingModel book)
        {
            var content = JsonSerializer.Serialize(book);
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

            var book = JsonSerializer.Deserialize<BookEditBindingModel>(content, _options);

            return book;
        }

        public async Task UpdateBook(BookEditBindingModel book)
        {
            var content = JsonSerializer.Serialize(book);
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
    }
}
