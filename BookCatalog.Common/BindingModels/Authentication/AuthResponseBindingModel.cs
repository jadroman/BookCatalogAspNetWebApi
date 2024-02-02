using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BookCatalog.Common.BindingModels.Authentication
{
    public class AuthResponseBindingModel
    {
        public UserBindingModel UserInfo { get; set; }
        public bool IsAuthSuccessful { get; set; }
        public string ErrorMessage { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}
