using AutoMapper;
using BookCatalog.Contracts.BindingModels.Book;
using BookCatalog.Contracts.Entities;
using BookCatalog.Contracts.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalogAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;
        private IMapper _mapper;

        public BookController(IBookService bookService, IMapper mapper)
        {
            _bookService = bookService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _bookService.GetAllBooks();
            var bookResult = _mapper.Map<IEnumerable<BookBindingModel>>(books);

            return Ok(bookResult);
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
                var bookResult = _mapper.Map<BookBindingModel>(book);
                return Ok(bookResult);
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

            var bookEntity = _mapper.Map<Book>(book);

            await _bookService.SaveBook(bookEntity);

            var createdBook = _mapper.Map<BookBindingModel>(bookEntity);

            return CreatedAtRoute("BookById", new { id = createdBook.Id }, createdBook);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] BookEditBindingModel book)
        {
            if (book == null)
            {
                return BadRequest("Book object is null");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model object");
            }

            var bookEntity = await _bookService.GetBookById(id);

            _mapper.Map(book, bookEntity);

            await _bookService.SaveBook(bookEntity);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _bookService.GetBookById(id);
            if (book == null)
            {
                return NotFound();
            }
            await _bookService.DeleteBook(book);

            return NoContent();
        }
    }
}
