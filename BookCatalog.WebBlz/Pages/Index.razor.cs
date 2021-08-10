using BookCatalog.WebBlz.HttpRepository;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Pages
{
    public partial class Index
    {

        [Inject]
        public NavigationManager NavigationManager { get; set; }


        protected override void OnInitialized()
        {
            NavigationManager.NavigateTo("/book");
        }
    }
}
