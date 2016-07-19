using FoodStockLibrary;
using FoodStockLibrary.ModelLibrary.EntityFrameworkLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FoodStockManager.Web.Controllers.api
{
    public class OrderAPIController : ApiController
    {
        [HttpPost]
        public HttpResponseMessage SaveOrder([FromBody]Order order)
        {
            try
            {
                string errMsg = string.Empty;
                order.Status = StatusUtil.OrderStatus.Requested.ToString();
                order.OrderdOn = DateTime.Now;
                order.Number = StatusUtil.GenerateOrderNumber();
                bool result = OrderPL.Save(order);
                if (string.IsNullOrEmpty(errMsg))
                    return result.Equals(true) ? Request.CreateResponse(HttpStatusCode.OK, "Order made successfully.") : Request.CreateResponse(HttpStatusCode.BadRequest, "Request failed");
                else
                {
                    var response = Request.CreateResponse(HttpStatusCode.BadRequest, errMsg);
                    return response;
                }
            }
            catch (Exception ex)
            {
                ErrorHandler.WriteError(ex);
                var response = Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
                return response;
            }
        }
    }
}
