using AutoMapper;
using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.BindingModels.Category;
using BookCatalog.Common.Entities;
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
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly IMapper _mapper; 

        public CategoryController(ICategoryService categoryService, IMapper mapper)
        {
            _categoryService = categoryService;
            _mapper = mapper; 
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories([FromQuery] CategoryParameters categoryParameters)
        {
            var categories = await _categoryService.GetCategories(categoryParameters);

            Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(categories.MetaData));

            var categoryResult = new PagedBindingEntity<CategoryBindingModel>
            {
                Items = _mapper.Map<IEnumerable<CategoryBindingModel>>(categories),
                MetaData = categories.MetaData
            };

            return Ok(categoryResult);
        }

        [HttpGet("{id}", Name = "CategoryById")]
        public async Task<IActionResult> GetCategoryById(int? id)
        {
            var category = await _categoryService.GetCategoryById(id.Value);
            if (category == null)
            {
                return NotFound();
            }
            else
            {
                var categoryResult = _mapper.Map<CategoryBindingModel>(category);
                return Ok(categoryResult);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryEditBindingModel category)
        {
            if (category == null)
            {
                return BadRequest("Category object is null");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid category object");
            }

            var categoryEntity = _mapper.Map<Category>(category);

            await _categoryService.SaveCategory(categoryEntity);

            var createdCategory = _mapper.Map<CategoryBindingModel>(categoryEntity);

            return CreatedAtRoute("CategoryById", new { id = createdCategory.Id }, createdCategory);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCategory([FromRoute] int id, [FromBody] CategoryEditBindingModel category)
        {
            if (category == null)
            {
                return BadRequest("Category object is null");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model object");
            }

            var categoryEntity = await _categoryService.GetCategoryById(id, true);

            _mapper.Map(category, categoryEntity);

            await _categoryService.SaveCategory(categoryEntity);

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCategory([FromRoute] int id)
        {
            var category = await _categoryService.GetCategoryById(id);

            if (category == null)
            {
                return NotFound();
            }
            await _categoryService.DeleteCategory(category);

            return NoContent();
        }
    }
}
