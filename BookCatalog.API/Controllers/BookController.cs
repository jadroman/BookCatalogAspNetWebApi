using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Helpers;
using BookCatalog.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BookCatalog.API.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet]
        public async Task<IActionResult> GetBooks([FromQuery] BookParameters bookParameters)
        {
            var books = await _bookService.GetBooks(bookParameters);
            Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(books.MetaData));

            return Ok(books);
        }

        [HttpGet("All")]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _bookService.GetAllBooks();

            return Ok(books);
        }

        [HttpGet("{id}", Name = "BookById")]
        public async Task<IActionResult> GetBookById(int? id)
        {
            var book = await _bookService.GetBookById(id.Value);

            if (book == null)
            {
                return NotFound();
            }
            else
            {
                return Ok(book);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateBook([FromBody] BookEditBindingModel book)
        {
            if (book == null)
            {
                return BadRequest("Book object is null");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid book object");
            }

            await _bookService.InsertBook(book);

            return CreatedAtRoute("BookById", new { id = book.Id }, book);
        }

        [HttpPost("{id:int}")]
        public async Task<IActionResult> UpdateBook([FromRoute] int id, [FromBody] BookEditBindingModel book)
        {
            if (book == null)
            {
                return BadRequest("Book object is null");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model object");
            }

            await _bookService.UpdateBook(book, id);

            return NoContent();
        }

        [HttpPost("Delete")]
        public async Task<IActionResult> DeleteBook([FromBody] DeleteBindingModel book)
        {
            await _bookService.DeleteBook(book.Id);

            return NoContent();
        }

        [HttpPost("DeleteList")]
        public async Task<IActionResult> DeleteBookList([FromBody] DeleteListBindingModel books)
        {
            await _bookService.DeleteBookList(books.IdList);

            return NoContent();
        }
    }
}
