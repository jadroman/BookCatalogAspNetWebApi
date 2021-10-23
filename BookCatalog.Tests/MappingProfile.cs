using AutoMapper;
using BookCatalog.Common.BindingModels.Book;
using BookCatalog.Common.BindingModels.Category;
using BookCatalog.Common.BindingModels.Registration;
using BookCatalog.Common.Entities;

namespace BookCatalog.Tests
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Category, CategoryBindingModel>();
            CreateMap<CategoryBindingModel, Category>();
            CreateMap<Book, BookBindingModel>();
            CreateMap<BookEditBindingModel, Book>();
            CreateMap<CategoryEditBindingModel, Category>();
            CreateMap<UserForRegistrationBindingModel, User>()
                .ForMember(u => u.UserName, opt => opt.MapFrom(x => x.Email));
        }
    }
}
