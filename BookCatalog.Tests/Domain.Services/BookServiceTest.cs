using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using BookCatalog.Common.Interfaces;
using BookCatalog.Domain.Services;
using Microsoft.EntityFrameworkCore;
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
                        Author = "Author1", Note = "Note1", Year = 1,
                        Publisher = "Publisher", Collection = "Collection1"
                    },
                    new Book
                    {
                        Id = 2, Title = "Title2",
                        Author = "Author2", Note = "Note2", Year = 2,
                        Publisher = "Publisher2", Collection = "Collection2"
                    },
                    new Book
                    {
                        Id = 3, Title = "Title3",
                        Author = "Author3", Note = "Note3", Year = 3,
                        Publisher = "Publisher3", Collection = "Collection3"
                    },
                    new Book
                    {
                        Id = 4, Title = "Title4",
                        Author = "Author4", Note = "Note4", Year = 4,
                        Publisher = "Publisher4", Collection = "Collection4"
                    },
                    new Book
                    {
                        Id = 5, Title = "Title5",
                        Author = "Author5", Note = "Note5", Year = 5,
                        Publisher = "Publisher5", Collection = "Collection5"
                    }
                };

            var bookMock = books.AsQueryable().BuildMockDbSet();

            _dbContext.Setup(repo => repo.Books)
                .Returns(bookMock.Object);
        }

        [Fact]
        public async Task GetBooks_ReturnsParameterizedPagedBooks()
        {
            // Arrange
            var _bookParams = new BookParameters
            {
                Author = "Author1",
                PageNumber = 0,
                PageSize = 5,
                MinYear = 1,
                MaxYear = 2
            };

            // Act
            var result = await _sut.GetBooks(_bookParams);

            // Assert
            Assert.True(result.Count == 1);
        }

    }
}
