using BookCatalog.Common.Helpers;
using BookCatalog.Common.Interfaces;
using BookCatalog.DAL;
using BookCatalog.Domain.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace BookCatalogAPI.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureCors(this IServiceCollection services, IConfiguration config)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder.WithOrigins(config["AllowedOrigins:angularClient"],
                                                    config["AllowedOrigins:blazorClient"])
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
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IBookCatalogContext, BookCatalogContext>(); 
            services.AddScoped<JwtHandler>();
        }

        public static void ConfigureAuthentication(this IServiceCollection services, IConfiguration config)
        {
            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = config.GetSection("JwtSettings:validIssuer").Value,
                    ValidAudience = config.GetSection("JwtSettings:validAudience").Value,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.GetSection("JwtSettings:securityKey").Value))
                };
            });
        }
    }
}
