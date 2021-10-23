using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Helpers;
using BookCatalog.Common.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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

        [HttpPut("{id:int}")]
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

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteBook([FromRoute] int id)
        {
            await _bookService.DeleteBook(id);

            return NoContent();
        }
    }
}
