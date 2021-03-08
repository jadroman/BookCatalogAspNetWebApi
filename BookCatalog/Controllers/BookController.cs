using AutoMapper;
using Contracts.DTOs;
using Contracts.Interfaces.Logger;
using Contracts.Interfraces.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        private ILoggerManager _logger;
        private IBookRepository _repository; 
        private IMapper _mapper;
        public BookController(ILoggerManager logger, IBookRepository repository, IMapper mapper)
        {
            _logger = logger;
            _repository = repository;
            _mapper = mapper;
        }


        [HttpGet]
        public IActionResult GetAllBooks()
        {
            try
            {
                var books = _repository.GetAllBooks();
                _logger.LogInfo($"Returned all owners from database.");
                var result = _mapper.Map<IEnumerable<BookDTO>>(books);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"BookController -> GetAllCategories(): {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpGet("{id}")]
        public IActionResult GetBookById(long id)
        {
            try
            {
                var book = _repository.GetBookById(id);
                if (book == null)
                {
                    _logger.LogError($"Book with id: {id}, hasn't been found in db.");
                    return NotFound();
                }
                else
                {
                    //_logger.LogInfo($"Returned owner with details for id: {id}");

                    var result = _mapper.Map<BookDTO>(book);
                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                //_logger.LogError($"Something went wrong inside GetOwnerWithDetails action: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
