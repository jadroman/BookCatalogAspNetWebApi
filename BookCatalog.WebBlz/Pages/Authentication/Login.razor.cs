using BookCatalog.Common.BindingModels.Authentication;
using BookCatalog.WebBlz.Services;
using BookCatalog.WebBlz.Services.Interfaces;
using Microsoft.AspNetCore.Components;
using System;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Pages.Authentication
{
    public partial class Login : IDisposable
    {
        UserForAuthenticationBindingModel _userForAuthentication = new ();
        bool _isLoading = false;

        [Inject]
        public IAuthenticationService AuthenticationService { get; set; }

        [Inject]
        public NavigationManager NavigationManager { get; set; }

        [Inject]
        public HttpInterceptorService Interceptor { get; set; }

        public bool ShowAuthError { get; set; }
        public string Error { get; set; }

        protected override void OnInitialized()
        {
            Interceptor.RegisterEvent();
        }

        public async Task ExecuteLogin()
        {
            _isLoading = true;
            ShowAuthError = false;

            var result = await AuthenticationService.Login(_userForAuthentication);
            _isLoading = false;
            if (!result.IsAuthSuccessful)
            {
                Error = result.ErrorMessage;
                ShowAuthError = true;
            }
            else
            {
                NavigationManager.NavigateTo("/book");
            }
        }

        public void Dispose() => Interceptor.DisposeEvent();
    }
}
