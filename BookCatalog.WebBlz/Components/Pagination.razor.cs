using BookCatalog.WebBlz.Helpers;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Components
{
    public partial class Pagination
    {
        [Parameter]
        public int CurrentPage { get; set; }

        [Parameter]
        public int TotalPages { get; set; }

        [Parameter]
        public int PageSize { get; set; }

        [Parameter]
        public int TotalCount { get; set; }

        [Parameter]
        public bool HasPrevious { get; set; }

        [Parameter]
        public bool HasNext { get; set; }

        [Parameter]
        public int Spread { get; set; }

        [Parameter]
        public EventCallback<int> SelectedPage { get; set; }
        private List<PagingLink> _links;

        protected override void OnParametersSet()
        {
            CreatePaginationLinks();
        }

        private void CreatePaginationLinks()
        {
            _links = new List<PagingLink>();
            _links.Add(new PagingLink(CurrentPage, HasPrevious, "Previous"));
            for (int i = 0; i < TotalPages; i++)
            {
                if (i >= CurrentPage - Spread && i <= CurrentPage + Spread)
                {
                    _links.Add(new PagingLink(i, true, (i+1).ToString()) { Active = CurrentPage == i });
                }
            }
            _links.Add(new PagingLink(CurrentPage + 1, HasNext, "Next"));
        }

        private async Task OnSelectedPage(PagingLink link)
        {
            if (link.Page == CurrentPage || !link.Enabled)
                return;
            CurrentPage = link.Page;
            await SelectedPage.InvokeAsync(link.Page);
        }
    }
}
