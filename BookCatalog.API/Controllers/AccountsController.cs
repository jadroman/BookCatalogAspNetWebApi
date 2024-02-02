using AutoMapper;
using BookCatalog.Common.BindingModels.Authentication;
using BookCatalog.Common.BindingModels.Registration;
using BookCatalog.Common.Entities;
using BookCatalog.Common.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.API.Controllers
{
    [Route("api/accounts")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly JwtHandler _jwtHandler;
        private readonly IConfiguration _configuration;
        private readonly IConfigurationSection _jwtSettings;

        public AccountsController(UserManager<User> userManager, IMapper mapper, IConfiguration configuration, JwtHandler jwtHandler)
        {
            _userManager = userManager;
            _mapper = mapper;
            _jwtHandler = jwtHandler;
            _configuration = configuration;
            _jwtSettings = _configuration.GetSection("JwtSettings");
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] UserForAuthenticationBindingModel userForAuthentication)
        {
            var user = await _userManager.FindByNameAsync(userForAuthentication.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, userForAuthentication.Password))
                return Unauthorized(new AuthResponseBindingModel { ErrorMessage = "Invalid Authentication" });

            var signingCredentials = _jwtHandler.GetSigningCredentials();
            var claims = _jwtHandler.GetClaims(user);
            var tokenOptions = _jwtHandler.GenerateTokenOptions(signingCredentials, claims);
            var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            var refreshToken = _jwtHandler.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(Convert.ToDouble(_jwtSettings.GetSection("refreshTokenExpiryInDays").Value));
            await _userManager.UpdateAsync(user);

            return Ok(new AuthResponseBindingModel
            {
                UserInfo = new UserBindingModel
                { UserName = user.UserName, FirstName = user.FirstName, LastName = user.LastName, PhoneNum = user.PhoneNumber },
                IsAuthSuccessful = true,
                Token = token,
                RefreshToken = refreshToken
            });
        }

        [HttpPost("RefreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenBindingModel tokens)
        {
            if (tokens is null || string.IsNullOrEmpty(tokens.RefreshToken) || string.IsNullOrEmpty(tokens.ExpiredToken))
                return BadRequest("Invalid client request");

            var principal = _jwtHandler.GetPrincipalFromExpiredToken(tokens.ExpiredToken);
            var username = principal.Identity.Name;
            var user = await _userManager.FindByNameAsync(username);

            if (user == null || user.RefreshToken != tokens.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
                return Ok(new AuthResponseBindingModel { IsAuthSuccessful = false });

            var signingCredentials = _jwtHandler.GetSigningCredentials();
            var claims = _jwtHandler.GetClaims(user);
            var tokenOptions = _jwtHandler.GenerateTokenOptions(signingCredentials, claims);
            var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return Ok(new AuthResponseBindingModel { IsAuthSuccessful = true, Token = token });
        }

        [Authorize]
        [HttpPost("Registration")]
        public async Task<IActionResult> RegisterUser([FromBody] UserForRegistrationBindingModel userForRegistration)
        {
            if (userForRegistration == null || !ModelState.IsValid)
                return BadRequest();

            var user = _mapper.Map<User>(userForRegistration);

            var result = await _userManager.CreateAsync(user, userForRegistration.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);

                return BadRequest(new RegistrationResponseBindingModel { Errors = errors });
            }

            return StatusCode(201);
        }
    }
}
