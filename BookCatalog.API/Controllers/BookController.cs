using AutoMapper;
using BookCatalog.Contracts.BindingModels.Book;
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

        [HttpGet("{id}")]
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
    }
}
