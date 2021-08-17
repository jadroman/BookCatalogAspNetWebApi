
using Blazored.LocalStorage;
using BookCatalog.WebBlz.Auth;
using BookCatalog.WebBlz.Services.Interfaces;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Authorization;
using System;
using System.Net;
using System.Threading.Tasks;
using Toolbelt.Blazor;

namespace BookCatalog.WebBlz.Services
{
	public class HttpInterceptorService : IHttpInterceptorService
    {
		private readonly HttpClientInterceptor _interceptor;
        private readonly AuthenticationStateProvider _authStateProvider;
        private readonly ILocalStorageService _localStorage;
        private readonly NavigationManager _navManager;

        public HttpInterceptorService(HttpClientInterceptor interceptor, AuthenticationStateProvider authStateProvider, ILocalStorageService localStorage, NavigationManager navManager)
		{
			_interceptor = interceptor;
            _authStateProvider = authStateProvider;
            _localStorage = localStorage;
            _navManager = navManager;
        }

		public void RegisterEvent() => _interceptor.AfterSendAsync += InterceptResponse;

		private async Task InterceptResponse(object sender, HttpClientInterceptorEventArgs e)
		{
            if (e.Response != null)
            {
                if (!e.Response.IsSuccessStatusCode)
                {
                    var statusCode = e.Response.StatusCode;

                    switch (statusCode)
                    {
                        case HttpStatusCode.NotFound:
                            _navManager.NavigateTo("/CustomNotFound");
                            break;
                        case HttpStatusCode.Unauthorized:
                            await _localStorage.RemoveItemAsync("authToken");
                            ((AuthStateProvider)_authStateProvider).NotifyUserLogout();
                            e.Request.Headers.Authorization = null;
                            break;
                        default:
                            _navManager.NavigateTo("/CustomInternalServerError");
                            throw new ApplicationException(e.Response.ReasonPhrase);
                    }
                }
            }
            else
            {
                _navManager.NavigateTo("/CustomInternalServerError");
                throw new ApplicationException();
            }
        }

		public void DisposeEvent() => _interceptor.AfterSendAsync -= InterceptResponse;
	}
}
