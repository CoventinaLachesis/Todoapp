using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;

namespace ToDoAPI.DTOs
{
    public class Activity
    {
        public string Name{get; set;} 
        public DateTime When { get; set; }
    }
}