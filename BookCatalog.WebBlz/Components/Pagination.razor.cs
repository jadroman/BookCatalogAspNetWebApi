using BookCatalog.Common.Helpers;
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
        public PagingMetaData MetaData { get; set; }

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
            _links = new List<PagingLink>
            {
                new PagingLink(MetaData.CurrentPage - 1, MetaData.HasPrevious, "Previous")
            };

            for (int i = 0; i < MetaData.TotalPages; i++)
            {
                if (i >= MetaData.CurrentPage - Spread && i <= MetaData.CurrentPage + Spread)
                {
                    _links.Add(new PagingLink(i, true, (i+1).ToString()) { Active = MetaData.CurrentPage == i });
                }
            }

            _links.Add(new PagingLink(MetaData.CurrentPage + 1, MetaData.HasNext, "Next"));
        }

        private async Task OnSelectedPage(PagingLink link)
        {
            if (link.Page == MetaData.CurrentPage || !link.Enabled)
                return;
            MetaData.CurrentPage = link.Page;
            await SelectedPage.InvokeAsync(link.Page);
        }
    }
}
