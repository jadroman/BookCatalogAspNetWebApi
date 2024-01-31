using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Category;
using BookCatalog.Common.Helpers;
using BookCatalog.Common.Interfaces;
using BookCatalog.Domain.Services;
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

        [HttpPost("{id:int}")]
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

        [HttpPost("Delete")]
        public async Task<IActionResult> DeleteCategory([FromBody] DeleteBindingModel category)
        {
            var deleteResult = await _categoryService.DeleteCategory(category.Id);

            if (!deleteResult.IsSuccessful && deleteResult.Type == ResultType.Invalid)
                return BadRequest(deleteResult.Error);

            return NoContent();
        }

        [HttpPost("DeleteList")]
        public async Task<IActionResult> DeleteCategoryList([FromBody] DeleteListBindingModel categories)
        {
            await _categoryService.DeleteCategoryList(categories.IdList);

            return NoContent();
        }
    }
}
