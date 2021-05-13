using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookCatalog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ErrorController : Controller
    {
        private readonly ILogger<ErrorController> _logger;

        public ErrorController(ILogger<ErrorController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            string errorText = "An unexpected error occurred. Sorry for the inconvenience.";
            var context = HttpContext.Features.Get<IExceptionHandlerFeature>();

            if (context != null && context.Error != null)
            {
                _logger.LogError(context.Error.StackTrace);
                return StatusCode(500, $"{errorText} The error has been recorded.");
            }
            else
            {
                return StatusCode(500, errorText);
            }

        }
    }
}
