using BookCatalog.Common.Entities;
using BookCatalog.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using System.Linq;
using BookCatalog.Common.Helpers;
using System.Reflection;
using System.Text;
using AutoMapper;
using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;

namespace BookCatalog.Domain.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _bookRepo;
        private readonly IMapper _mapper;

        public BookService(IBookRepository bookRepo, IMapper mapper)
        {
            _bookRepo = bookRepo;
            _mapper = mapper;
        }

        /// <summary>
        /// Gets Books by params
        /// </summary>
        /// <param name="bookParameters">eg. ".../book?pageNumber=1&pageSize=5&orderBy=title desc&name=na"</param>
        /// <returns></returns>
        public async Task<PagedBindingEntity<BookBindingModel>> GetBooks(BookParameters bookParameters)
        {
            var books = _bookRepo.GetBooks();

            // 1. Search for specific
            Search(ref books, bookParameters);

            // 2. Sort by params
            Sort(ref books, bookParameters.OrderBy);

            // 3. Do paging of the final results
            var pagedList = await PagedList<Book>.ToPagedList(books, bookParameters.PageNumber, bookParameters.PageSize);

            var bookResult = new PagedBindingEntity<BookBindingModel>
            {
                Items = _mapper.Map<IEnumerable<BookBindingModel>>(pagedList),
                MetaData = pagedList.MetaData
            };

            return bookResult;
        }


        private void Search<T>(ref IQueryable<T> books, BookParameters bookParameters)
        {
            if (!books.Any())
                return;

            if (!string.IsNullOrWhiteSpace(bookParameters.Title))
                books = (IQueryable<T>)_bookRepo.GetBooksByTitle(bookParameters.Title.Trim().ToLower());

            if (!string.IsNullOrWhiteSpace(bookParameters.Author))
                books = (IQueryable<T>)_bookRepo.GetBooksByAuthor(bookParameters.Author.Trim().ToLower());

            if (!string.IsNullOrWhiteSpace(bookParameters.Note))
                books = (IQueryable<T>)_bookRepo.GetBooksByNote(bookParameters.Note.Trim().ToLower());

            if (!string.IsNullOrWhiteSpace(bookParameters.Category))
                books = (IQueryable<T>)_bookRepo.GetBooksByCategory(bookParameters.Category.Trim().ToLower());
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

        public async Task<BookBindingModel> GetBookById(int id, bool trackEntity = false)
        {
            Book book = await _bookRepo.GetBookById(id, trackEntity);
            return _mapper.Map<BookBindingModel>(book);
        }



        public async Task<int> UpdateBook(BookEditBindingModel book, int id)
        {
            var bookEntity = await _bookRepo.GetBookById(id, true);
            _mapper.Map(book, bookEntity);

            return await _bookRepo.UpdateBook();
        }

        public async Task<int> InsertBook(BookEditBindingModel book)
        {
            var bookEntity = _mapper.Map<Book>(book);
            return await _bookRepo.InsertBook(bookEntity);
        }

        public async Task<Result<int>> DeleteBook(int id)
        {
            var book = await _bookRepo.GetBookById(id);

            return new SuccessResult<int>(await _bookRepo.DeleteBook(book));
        }
    }
}
