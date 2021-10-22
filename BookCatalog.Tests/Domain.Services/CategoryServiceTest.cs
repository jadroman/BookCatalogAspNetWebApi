using AutoMapper;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using BookCatalog.Common.Interfaces;
using BookCatalog.Domain.Services;
using MockQueryable.Moq;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace BookCatalog.Tests.Domain.Services
{
    public class CategoryServiceTest
    {
        private readonly Mock<IBookCatalogContext> _dbContext;
        private readonly Mock<ICategoryRepository> _categoryRepo;
        private readonly Mock<IMapper> _mapper;

        private readonly ICategoryService _sut;

        public CategoryServiceTest()
        {
            _dbContext = new Mock<IBookCatalogContext>();
            _categoryRepo = new Mock<ICategoryRepository>();
            _mapper = new Mock<IMapper>();
            _sut = new CategoryService(_categoryRepo.Object, _mapper.Object);

            var cats = new List<Category> { new Category { Id = 1, Name = "Categ" } };
            var catsMock = cats.AsQueryable().BuildMockDbSet();

            _dbContext.Setup(repo => repo.Categories)
                .Returns(catsMock.Object);
        }

        [Fact]
        public async Task DeleteCategory_ReturnsError_IfRelatedWithBook()
        {
            // Arrange
            var category = new Category
            {
                Id = 1,
                Name = "Categ",
                Books = new List<Book> { new Book { Id = 1, Title = "Book" } }
            };

            // Act
            var result = await _sut.DeleteCategory(category.Id);

            // Assert
            Assert.IsType<InvalidResult<int>>(result);
        }

    }


}
