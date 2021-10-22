using BookCatalog.Common.BindingModels;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using BookCatalog.Common.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using System.Linq;
using System.Reflection;
using System.Text;
using System;
using AutoMapper;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.BindingModels.Category;

namespace BookCatalog.Domain.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepo;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository categoryRepo, IMapper mapper)
        {
            _categoryRepo = categoryRepo;
            _mapper = mapper;
        }

        /// <summary>
        /// Gets Categories by params
        /// </summary>
        /// <param name="categoryParameters">eg. ".../category?pageNumber=1&pageSize=5&orderBy=name desc&name=na"</param>
        /// <returns></returns>
        public async Task<PagedBindingEntity<CategoryBindingModel>> GetCategories(CategoryParameters categoryParameters)
        {
            var categories = _categoryRepo.GetCategories();

            // 1. Search for specific
            Search(ref categories, categoryParameters);

            // 2. Sort by params
            Sort(ref categories, categoryParameters.OrderBy);

            // 3. Do paging of the final results
            var pagedList = await PagedList<Category>.ToPagedList(categories, categoryParameters.PageNumber, categoryParameters.PageSize);

            var categoryResult = new PagedBindingEntity<CategoryBindingModel>
            {
                Items = _mapper.Map<IEnumerable<CategoryBindingModel>>(pagedList),
                MetaData = pagedList.MetaData
            };

            return categoryResult;
        }


        private void Search<T>(ref IQueryable<T> categories, CategoryParameters categoryParameters)
        {
            if (!categories.Any())
                return;

            if (!string.IsNullOrWhiteSpace(categoryParameters.Name))
                categories = (IQueryable<T>)_categoryRepo.GetCategoriesByName(categoryParameters.Name.Trim().ToLower());
        }

        private void Sort<T>(ref IQueryable<T> entities, string orderByQueryString)
        {
            if (!entities.Any())
                return;

            if (string.IsNullOrWhiteSpace(orderByQueryString))
            {
                return;
            }

            var entityParams = orderByQueryString.Trim().Split(',');
            var propertyInfos = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            var entityQueryBuilder = new StringBuilder();

            foreach (var param in entityParams)
            {
                if (string.IsNullOrWhiteSpace(param))
                    continue;

                var propertyFromQueryName = param.Split(" ")[0];
                var objectProperty = propertyInfos.FirstOrDefault(pi => pi.Name.Equals(propertyFromQueryName, StringComparison.InvariantCultureIgnoreCase));

                if (objectProperty == null)
                    continue;

                var sortingOrder = param.EndsWith(" desc") ? "descending" : "ascending";

                entityQueryBuilder.Append($"{objectProperty.Name} {sortingOrder}, ");
            }

            var entityQuery = entityQueryBuilder.ToString().TrimEnd(',', ' ');

            if (string.IsNullOrWhiteSpace(entityQuery))
            {
                return;
            }

            entities = entities.OrderBy(entityQuery);
        }

        public async Task<CategoryBindingModel> GetCategoryById(int id, bool trackEntity = false)
        {
            Category category = await _categoryRepo.GetCategoryById(id, trackEntity);
            return _mapper.Map<CategoryBindingModel>(category);
        }

      

        public async Task<int> UpdateCategory(CategoryEditBindingModel category, int id)
        {
            var categoryEntity = await _categoryRepo.GetCategoryById(id, true);
            _mapper.Map(category, categoryEntity);

            return await _categoryRepo.UpdateCategory();
        }

        public async Task<int> InsertCategory(CategoryEditBindingModel category)
        {
            var categoryEntity = _mapper.Map<Category>(category);
            return await _categoryRepo.InsertCategory(categoryEntity); 
        }

        public async Task<Result<int>> DeleteCategory(int id)
        {
            var category = await _categoryRepo.GetCategoryByIdWithBooks(id);

            if (category.Books != null && category.Books.Any())
            {
                return new InvalidResult<int>("There are some books related with this category.");
            }

            return new SuccessResult<int>(await _categoryRepo.DeleteCategory(category));
        }
    }
}
