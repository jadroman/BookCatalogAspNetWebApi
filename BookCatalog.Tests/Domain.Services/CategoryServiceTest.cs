using AutoMapper;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using BookCatalog.Common.Interfaces;
using BookCatalog.DAL;
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
        private readonly ICategoryRepository _categoryRepo;
        private readonly IMapper _mapper;
        private readonly ICategoryService _sut;
        private readonly int testCategId = 1;

        public CategoryServiceTest()
        {
            _dbContext = new Mock<IBookCatalogContext>();
            _categoryRepo = new CategoryRepository(_dbContext.Object);

            var config = new MapperConfiguration(c =>
            {
                c.AddProfile<MappingProfile>();
            });

            _mapper = config.CreateMapper();
            _sut = new CategoryService(_categoryRepo, _mapper);

            var cats = new List<Category>
            {
                new Category
                {
                    Id = testCategId, Name = "Categ",
                    Books = new List<Book> { new Book { Id = 1, Title = "Book" } }
                }
            };

            var catsMock = cats.AsQueryable().BuildMockDbSet();

            _dbContext.Setup(repo => repo.Categories)
                .Returns(catsMock.Object);
        }

        [Fact]
        public async Task DeleteCategory_ReturnsError_IfRelatedWithBook()
        {
            // Arrange
            // Act
            var result = await _sut.DeleteCategory(testCategId);

            // Assert
            Assert.IsType<InvalidResult<int>>(result);
        }

    }


}
