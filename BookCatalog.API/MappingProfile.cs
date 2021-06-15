using AutoMapper;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.BindingModels.Category;
using BookCatalog.Common.BindingModels.Registration;
using BookCatalog.Common.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalogAPI
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Category, CategoryBindingModel>();
            CreateMap<Book, BookBindingModel>();
            CreateMap<BookEditBindingModel, Book>();
            CreateMap<CategoryEditBindingModel, Category>();
            CreateMap<UserForRegistrationBindingModel, User>()
                .ForMember(u => u.UserName, opt => opt.MapFrom(x => x.Email));
        }
    }
}
