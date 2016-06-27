using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FoodStockManager.Web.Controllers
{
    public class ProductController : Controller
    {
        // GET: Product
        public ActionResult AddProduct()
        {
            return View();
        }

        public ActionResult UpdateProduct()
        {
            return View();
        }

        public ActionResult ViewProduct()
        {
            return View();
        }
    }
}