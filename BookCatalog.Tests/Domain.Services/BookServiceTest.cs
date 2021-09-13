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
    public class BookServiceTest
    {
        private readonly Mock<IBookCatalogContext> _dbContext;

        private readonly IBookService _sut;

        public BookServiceTest()
        {
            _dbContext = new Mock<IBookCatalogContext>();
            _sut = new BookService(_dbContext.Object);

            var books = new List<Book>
                {
                    new Book
                    {
                        Id = 1, Title = "Title1",
                        Author = "Author1", Note = "Note1", Year = 1
                    },
                    new Book
                    {
                        Id = 2, Title = "Title2",
                        Author = "Author2", Note = "Note2", Year = 2
                    },
                    new Book
                    {
                        Id = 3, Title = "Title3",
                        Author = "Author3", Note = "Note3", Year = 3
                    },
                    new Book
                    {
                        Id = 4, Title = "Title4",
                        Author = "Author4", Note = "Note4", Year = 4
                    },
                    new Book
                    {
                        Id = 5, Title = "Title5",
                        Author = "Author5", Note = "Note5", Year = 5
                    }
                };

            var bookMock = books.AsQueryable().BuildMockDbSet();

            _dbContext.Setup(repo => repo.Books)
                .Returns(bookMock.Object);
        }

        [Theory]
        [InlineData("Title1", "Author1", 1, "Note1")]
        [InlineData("Title2", "Author2", 2, "Note2")]
        [InlineData("Title3", "Author3", 3, "Note3")]
        [InlineData("Title4", "Author4", 4, "Note4")]
        [InlineData("Title5", "Author5", 5, "Note5")]
        public async Task GetBooks_ReturnsSearchedBooksOnly_WhenSearchingByParameters(string title, string author, uint year, string note)
        {
            // Arrange
            var _bookParams = new BookParameters
            {
                Title = title,
                Author = author,
                Note = note,
                PageNumber = 0,
                MinYear = year,
                MaxYear = year
            };

            // Act
            var result = await _sut.GetBooks(_bookParams);

            // Assert
            Assert.True(result.Count == 1);
        }

    }
}
