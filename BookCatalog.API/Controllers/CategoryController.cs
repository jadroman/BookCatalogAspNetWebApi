using BookCatalog.Common.BindingModels.Category;
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
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories([FromQuery] CategoryParameters categoryParameters)
        {
            var categories = await _categoryService.GetCategories(categoryParameters);
            Response.Headers.Add("X-Pagination", JsonConvert.SerializeObject(categories.MetaData));

            return Ok(categories);
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
                return Ok(category);
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

            await _categoryService.InsertCategory(category);

            return CreatedAtRoute("CategoryById", new { id = category.Id }, category);
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

            await _categoryService.UpdateCategory(category, id);

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCategory([FromRoute] int id)
        {
            var deleteResult = await _categoryService.DeleteCategory(id);

            if (!deleteResult.IsSuccessful && deleteResult.Type == ResultType.Invalid) 
                return BadRequest(deleteResult.Error);

            return NoContent();
        }
    }
}
