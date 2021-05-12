using AutoMapper;
using BookCatalog.Contracts.BindingModels.Book;
using BookCatalog.Contracts.Entities;
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
            //CreateMap<CategoryBindingModel, Category>();
        }
    }
}
