﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FoodStockManager.Web.Controllers
{
    public class RoleController : Controller
    {
        // GET: Role
        public ActionResult AddRole()
        {
            return View();
        }

        public ActionResult ViewRole()
        {
            return View();
        }

        public ActionResult UpdateRole()
        {
            return View();
        }
    }
}