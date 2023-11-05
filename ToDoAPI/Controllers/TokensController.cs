using Microsoft.AspNetCore.Mvc;
using ToDoAPI.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Security.Cryptography;

namespace ToDoAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class TokensController : ControllerBase
{
    private readonly ILogger<TokensController> _logger;

    public TokensController(ILogger<TokensController> logger)
    {
        _logger = logger;
    }

    
    [Route("")]
    [HttpPost]
    public IActionResult Post([FromBody] DTOs.Login data)
    {  
        
        
        var db= new ToDoDbContext();
        var user =db.Users.Find(data.Id);
        if (user==null)return Unauthorized();


        string hash = Convert.ToBase64String(
            KeyDerivation.Pbkdf2(
                password:data.Password,
                salt:Convert.FromBase64String(user.Salt),
                prf:KeyDerivationPrf.HMACSHA1,
                iterationCount:10000,
                numBytesRequested:256/8
            )
        );
        if (user.Password!=hash) return Unauthorized();


        var desc = new SecurityTokenDescriptor();
        desc.Subject = new ClaimsIdentity(
            new Claim[] {
                new Claim(ClaimTypes.Name, user.Id),
                new Claim(ClaimTypes.Role, "user")
            }
        );
        desc.NotBefore = DateTime.UtcNow;
        desc.Expires = DateTime.UtcNow.AddHours(3);
        desc.IssuedAt = DateTime.UtcNow;
        desc.Issuer = "ToDoApp"; // any string is ok
        desc.Audience = "public"; // any string is ok
        desc.SigningCredentials = new SigningCredentials(
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(Program.SecurityKey)
            ),
            SecurityAlgorithms.HmacSha256Signature
        );
        var handler = new JwtSecurityTokenHandler();
        var token = handler.CreateToken(desc);
        
        return Ok(new { token = handler.WriteToken(token) });

    }
    [Route("register")]
    [HttpPost]
    public IActionResult Register([FromBody] DTOs.Register data)
        {
            // Check if the user with the provided Id already exists
            var db = new ToDoDbContext();
            var existingUser = db.Users.FirstOrDefault(u => u.Id == data.Id);
            if (existingUser != null)
            {
                return BadRequest("Id already exists");
            }

            // Generate a unique salt for the user
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            // Hash the user's password with the generated salt
            string hash = Convert.ToBase64String(
                KeyDerivation.Pbkdf2(
                    password: data.Password,
                    salt: salt,
                    prf: KeyDerivationPrf.HMACSHA1,
                    iterationCount: 10000,
                    numBytesRequested: 256 / 8
                )
            );

            // Create a new user and save it to the database
            var newUser = new User
            {
                Id = data.Id,
                Password = hash,
                Salt = Convert.ToBase64String(salt)
            };

            db.Users.Add(newUser);
            db.SaveChanges();

            // Generate and return a JWT token for the registered user (optional)
            var desc = new SecurityTokenDescriptor();
            desc.Subject = new ClaimsIdentity(
                new Claim[] {
                    new Claim(ClaimTypes.Name, newUser.Id),
                    new Claim(ClaimTypes.Role, "user")
                }
            );
            desc.NotBefore = DateTime.UtcNow;
            desc.Expires = DateTime.UtcNow.AddHours(3);
            desc.IssuedAt = DateTime.UtcNow;
            desc.Issuer = "ToDoApp"; // any string is ok
            desc.Audience = "public"; // any string is ok
            desc.SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(Program.SecurityKey)
                ),
                SecurityAlgorithms.HmacSha256Signature
            );
            var handler = new JwtSecurityTokenHandler();
            var token = handler.CreateToken(desc);

            return Ok(new { token = handler.WriteToken(token) });
}
}