using AutoMapper.Internal;
using BookCatalog.Common.Entities;
using BookCatalog.DAL;
using BookCatalogAPI;
using BookCatalogAPI.Extensions;
using Microsoft.AspNetCore.Authentication.Certificate;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.IO;
using System.Linq;

namespace BookCatalog
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }


        public void ConfigureServices(IServiceCollection services)
        {
            services.AddIdentity<User, IdentityRole>()
                    .AddEntityFrameworkStores<BookCatalogContext>();

            services.AddAuthentication(CertificateAuthenticationDefaults.AuthenticationScheme)
               .AddCertificate();

            services.ConfigureAuthentication(Configuration);
            services.ConfigureCors(Configuration);
            services.ConfigureDbContext(Configuration);
            services.ConfigureServices();
            services.AddAutoMapper(cfg => cfg.Internal().MethodMappingEnabled = false, typeof(MappingProfile).Assembly);
            services.AddControllers().AddNewtonsoftJson(options =>
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
            );
            services.AddSwaggerGen();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment() || env.IsEnvironment("Container"))
            {
                using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
                {
                    var context = serviceScope.ServiceProvider.GetService<BookCatalogContext>();
                    if (context.Database.EnsureCreated())
                    {
                        // seed data
                        if (!context.Users.AsQueryable().Any())
                        {
                            if (env.IsEnvironment("Container"))
                            {
                                context.Database.ExecuteSqlRaw(File.ReadAllText(@"../doc/updateDatabase.sql"));
                            }
                            else
                            {
                                context.Database.ExecuteSqlRaw(File.ReadAllText(@"..\doc\updateDatabase.sql"));
                            }
                        }
                    }
                }
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/api/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V2");
            });

        }
    }
}
