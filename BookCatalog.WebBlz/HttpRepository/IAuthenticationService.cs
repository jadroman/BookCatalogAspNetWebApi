using BookCatalog.Common.BindingModels.Authentication;
using BookCatalog.Common.BindingModels.Registration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.HttpRepository
{
    public interface IAuthenticationService
    {
        Task<RegistrationResponseBindingModel> RegisterUser(UserForRegistrationBindingModel userForRegistration);
        Task<AuthResponseBindingModel> Login(UserForAuthenticationBindingModel userForAuthentication);
        Task Logout();
    }
}
