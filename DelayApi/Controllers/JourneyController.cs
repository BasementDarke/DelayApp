using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DelayApi.Controllers
{
    [ApiController]
    [Route("api/journey")]
    public class JourneyController : Controller
    {
        // GET: JourneyController
        public ActionResult Index()
        {
            return View();
        }
    }
}
