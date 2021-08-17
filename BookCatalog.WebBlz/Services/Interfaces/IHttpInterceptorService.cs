using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz.Services.Interfaces
{
    public interface IHttpInterceptorService
    {
        void RegisterEvent();
        void DisposeEvent();
    }
}
