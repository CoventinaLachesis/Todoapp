using System;
using System.Collections.Generic;

namespace ToDoAPI.Models;

public partial class User
{
    public string Id { get; set; } = null!;

    public string? Password { get; set; }

    public string? Salt { get; set; }
}
