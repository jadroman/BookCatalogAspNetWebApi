using BookCatalog.API.Controllers;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using BookCatalog.Common.Interfaces;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace BookCatalog.Tests.API.Controllers
{
    public class BookControllerTest
    {
        private readonly Mock<IBookService> _bookService;
        private readonly BookController _sut;

        public BookControllerTest()
        {
            BookParameters _bookParams;
            var books = new List<Book>
            { 
                new Book{ Id = 1, Title = "book title" },
                new Book{ Id = 1, Title = "book title" },
            };

            var _pagedBooks = new PagedList<Book>(books, 1, 1, 5);

            _bookParams = new BookParameters();    

            _bookService = new Mock<IBookService>();
            _bookService.Setup(srv => srv.GetBooks(_bookParams))
                .Returns(Task.FromResult(_pagedBooks));
        }


        [Fact]
        public async Task GetBooks_ReturnsPagedBooks()
        {
            // Arrange

            // Act

            // Assert
        }
    }
}
