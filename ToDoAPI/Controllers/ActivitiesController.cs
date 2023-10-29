using Microsoft.AspNetCore.Mvc;
using ToDoAPI.Models;
using Microsoft.AspNetCore.Authorization;
namespace ToDoAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class ActivitiesController : ControllerBase
{
    private readonly ILogger<ActivitiesController> _logger;

    public ActivitiesController(ILogger<ActivitiesController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    [Route("")]
    [Authorize(Roles ="user")]
    public IActionResult Get()
    {   var db = new ToDoDbContext();
    var activities = from a in db.Activities select a;
    if (!activities.Any()) return NoContent(); 
    return Ok(activities);

    }

    [Route("{id}")]
    [HttpGet]
    public IActionResult Get2(uint id)
    {
        var db = new ToDoDbContext();
        var activity=(from a in db.Activities select a).FirstOrDefault();
        if (activity==null) return NotFound();
        return Ok(activity);
    }

    [HttpPost]
    public IActionResult Post([FromBody] DTOs.Activity data)
    {
        var db = new ToDoDbContext();
        var activity= new Models.Activity();
        activity.Name =data.Name;
        activity.When=data.When;

        db.Activities.Add(activity);
        db.SaveChanges();
        return Ok();
    }
    [HttpPut]
    public IActionResult Put(uint id,[FromBody] DTOs.Activity data)
    {
        var db = new ToDoDbContext();
        var activity= db.Activities.Find(id);
        activity.Name =data.Name;
        activity.When=data.When;

        db.SaveChanges();
        return Ok();
    }

    [HttpDelete]
    public IActionResult Delete(uint id)
    {
        var db = new ToDoDbContext();
        var activity= db.Activities.Find(id);

        db.Activities.Remove(activity);
        db.SaveChanges();
        return Ok();
    }


}
