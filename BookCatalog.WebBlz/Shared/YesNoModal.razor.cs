using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Shared
{
    public partial class YesNoModal
    {
        private string _modalDisplay;
        private string _modalClass;
        private string _confimText;
        private bool _showBackdrop;
        private object _entityId;

        [Parameter]
        public EventCallback<object> Confirmed { get; set; }


        [Parameter]
        public EventCallback Rejected { get; set; }

        [Inject]
        public NavigationManager Navigation { get; set; }

        public void Show(string confimText, object entityId = null)
        {
            if (entityId != null)
            {
                _entityId = entityId;
            }

            _confimText = confimText;
            _modalDisplay = "block;";
            _modalClass = "show";
            _showBackdrop = true;
            //StateHasChanged();
        }

        private void Hide()
        {
            _modalDisplay = "none;";
            _modalClass = "";
            _showBackdrop = false;
            //StateHasChanged();
        }

        private async Task Confirm()
        {
            Hide();
            await Confirmed.InvokeAsync(_entityId);
        }

        private async Task Reject()
        {
            Hide();
            await Rejected.InvokeAsync();
        }
    }
}
