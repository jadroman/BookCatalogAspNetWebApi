using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Shared
{
    public partial class SpinnerModal
    {
        private string _modalDisplay;
        private string _modalClass;
        private bool _showBackdrop;


        public void Show()
        {
            _modalDisplay = "block;";
            _modalClass = "show";
            _showBackdrop = true;
        }

        public void Hide()
        {
            _modalDisplay = "none;";
            _modalClass = "";
            _showBackdrop = false;
        }

    }
}
