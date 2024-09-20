using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication3.Interfaces;
using WebApplication3.Models;
using WebApplication3.Services;

namespace WebApplication3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PointController : ControllerBase
    {
        private readonly PointService _pointService;

        public PointController(PointService pointService)
        {
            _pointService = pointService;
        }

        [HttpGet]
        public ActionResult<Response<List<Point>>> GetAll()
        {
            var response = _pointService.GetAll();
            if (!response.Status)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        [HttpGet("{id}")]
        public ActionResult<Response<Point>> GetById(long id)
        {
            var response = _pointService.GetById(id);
            if (!response.Status)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<Response<Point>>> Add(Point point)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new Response<Point>(false, "Invalid model state.", null));
            }

            var response = _pointService.Add(point);
            if (!response.Status)
            {
                return BadRequest(response);
            }
            return CreatedAtAction(nameof(GetById), new { id = response.Value.Id }, response);
        }


        [HttpPut("{id}")]
        public ActionResult<Response<Point>> Update(long id, Point point)
        {
            if (id != point.Id)
            {
                return BadRequest(new Response<Point>(false, "Point ID mismatch.", null));
            }

            var response = _pointService.Update(point);
            if (!response.Status)
            {
                return NotFound(response);
            }
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public ActionResult<Response<Point>> Delete(long id)
        {
            var response = _pointService.Delete(id);
            if (!response.Status)
            {
                return NotFound(response);
            }
            return Ok(response);
        }
    }
}