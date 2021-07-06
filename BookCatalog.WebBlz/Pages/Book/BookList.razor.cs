using BookCatalog.Common.BindingModels;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using BookCatalog.WebBlz.HttpRepository;
using BookCatalog.WebBlz.Shared;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Pages.Book
{
    public partial class BookList
    {
        bool _isLoading = true;
        PagedBindingEntity<BookBindingModel> _response;
        PagingMetaData _pagingMetaData = new();
        List<BookBindingModel> _bookList = new();
        BookParameters _bookParameters = new();
        YesNoModal _yesNoModal;

        [Inject]
        IBookHttpRepository Repository { get; set; }

        protected async override Task OnInitializedAsync()
        {
            await GetBooks();
        }

        private void DeleteBook(int id)
        {
            _yesNoModal.Show($@"Are you sure you want to delete ""{GetBookTitleById(id)}"" book?", id);
        }

        private string GetBookTitleById(int id)
        {
            string bookTitle = "";
            if (_bookList != null && _bookList.Count > 0)
            {
                bookTitle = _bookList.Where(c => c.Id == id).FirstOrDefault().Title;
            }

            return bookTitle;
        }

        public async Task BookDeletionConfirmed(object id)
        {
            await Repository.DeleteBook(Convert.ToInt32(id));
            await GetBooks();
        }

        private async Task GetBooks()
        {
            _response = await Repository.GetBooks(_bookParameters);
            _isLoading = false;
            _bookList = _response.Items.ToList();
            _pagingMetaData = _response.MetaData;
        }

        private async Task SelectedPage(int page)
        {
            _bookParameters.PageNumber = page;
            await GetBooks();
        }
        private async Task SearchChanged(string searchTerm)
        {
            _bookParameters.PageNumber = 0;
            _bookParameters.Title = searchTerm;
            await GetBooks();
        }
    }
}
