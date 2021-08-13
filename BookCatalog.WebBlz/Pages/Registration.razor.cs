using BookCatalog.Common.BindingModels.Registration;
using BookCatalog.WebBlz.HttpRepository;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Pages
{
    public partial class Registration : IDisposable
    {
        UserForRegistrationBindingModel _userForRegistration = new ();

        [Inject]
        public IAuthenticationService AuthenticationService { get; set; }

        [Inject]
        public NavigationManager NavigationManager { get; set; }

        public bool ShowRegistrationErrors { get; set; }

        public IEnumerable<string> Errors { get; set; }

        [Inject]
        public HttpInterceptorService Interceptor { get; set; }

        protected override void OnInitialized()
        {
            Interceptor.RegisterEvent();
        }

        public async Task Register()
        {
            ShowRegistrationErrors = false;

            var result = await AuthenticationService.RegisterUser(_userForRegistration);
            if (!result.IsSuccessfulRegistration)
            {
                Errors = result.Errors;
                ShowRegistrationErrors = true;
            }
            else
            {
                NavigationManager.NavigateTo("/");
            }
        }

        public void Dispose() => Interceptor.DisposeEvent();
    }
}
