using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FoodStockManager.Web.Controllers
{
    public class OrderController : Controller
    {
        // GET: Order
        public ActionResult RequestOrder()
        {
            return View();
        }
    }
}