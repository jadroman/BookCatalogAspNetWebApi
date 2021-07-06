using BookCatalog.WebBlz.HttpRepository;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace BookCatalog.WebBlz
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebAssemblyHostBuilder.CreateDefault(args);
            builder.RootComponents.Add<App>("#app");

            // TODO: move url to config file
            builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri("http://localhost:5000/api/") });
            builder.Services.AddScoped<ICategoryHttpRepository, CategoryHttpRepository>();
            builder.Services.AddScoped<IBookHttpRepository, BookHttpRepository>();

            await builder.Build().RunAsync();
        }
    }
}
