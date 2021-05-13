using BookCatalog.Common.Interfaces;
using BookCatalog.DAL;
using BookCatalog.Domain.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalogAPI.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader());
            });
        }

        public static void ConfigureDbContext(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<BookCatalogContext>(opt => opt.UseSqlServer(config["ConnectionStrings:BookCatalogConnection"]));
        }

        public static void ConfigureServices(this IServiceCollection services)
        {
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IBookService, BookService>();
            services.AddScoped<IBookService, BookService>();
            services.AddScoped<IBookCatalogContext, BookCatalogContext>();
        }
        public static void ConfigureIISIntegration(this IServiceCollection services)
        {
            services.Configure<IISOptions>(options =>
            {

            });
        }
    }
}
