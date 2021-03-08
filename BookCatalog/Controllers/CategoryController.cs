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
    public class CategoryController : ControllerBase
    {
        private ILoggerManager _logger;
        private ICategoryRepository _repository; 
        private IMapper _mapper;
        public CategoryController(ILoggerManager logger, ICategoryRepository repository, IMapper mapper)
        {
            _logger = logger;
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetAllCategories()
        {
            try
            {
                var categores = _repository.GetAllCategories();
                _logger.LogInfo($"Returned all owners from database.");
                var result = _mapper.Map<IEnumerable<CategoryDTO>>(categores);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"CategoryController -> GetAllCategories(): {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetCategoryById(long id)
        {
            try
            {
                var cat = _repository.GetCategoryById(id);
                if (cat == null)
                {
                    _logger.LogError($"Category with id: {id}, hasn't been found in db.");
                    return NotFound();
                }
                else
                {
                    //_logger.LogInfo($"Returned owner with details for id: {id}");

                    var result = _mapper.Map<CategoryDTO>(cat);
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
