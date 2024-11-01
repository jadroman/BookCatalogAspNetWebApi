using AutoMapper;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using BookCatalog.DAL;
using BookCatalog.Domain.Services;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace BookCatalog.Tests.Domain.Services
{
    /// <summary>
    /// using SQLite in-memory db for unit tests
    /// </summary>
    public class BookServiceTest : IDisposable
    {
        private readonly IMapper _mapper;
        private readonly DbConnection _connection;
        private readonly DbContextOptions<BookCatalogContext> _contextOptions;

        public BookServiceTest()
        {
            // SQLite in-memory
            _connection = new SqliteConnection("Filename=:memory:");
            _connection.Open();

            _contextOptions = new DbContextOptionsBuilder<BookCatalogContext>()
                .UseSqlite(_connection)
                .Options;

            // Create the schema and seed some data
            using var context = new BookCatalogContext(_contextOptions);
            context.Database.EnsureCreated();

            var config = new MapperConfiguration(c =>
            {
                c.AddProfile<MappingProfile>();
            });

            _mapper = config.CreateMapper();

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

            context.AddRange(books);
            context.SaveChanges();
        }

        public void Dispose() => _connection.Dispose();

        [Theory]
        [InlineData("Title1", "Author1", 1, "Note1")]
        [InlineData("Title2", "Author2", 2, "Note2")]
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
            var srv = new BookService(new BookRepository(new BookCatalogContext(_contextOptions)), _mapper);
            var result = await srv.GetBooks(_bookParams);

            // Assert
            Assert.True(result.Items.Count() == 1);
        }

    }
}
