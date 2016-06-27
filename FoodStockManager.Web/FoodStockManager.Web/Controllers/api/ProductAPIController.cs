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
    public class ProductAPIController : ApiController
    {
        [HttpPost]
        public HttpResponseMessage SaveProduct([FromBody]Product product)
        {
            try
            {
                string errMsg = string.Empty;
                product.Status = StatusUtil.Status.Active.ToString();
                product.CreatedOn = System.DateTime.Now;

                bool result = ProductPL.Save(product, out errMsg);
                if (string.IsNullOrEmpty(errMsg))
                    return result.Equals(true) ? Request.CreateResponse(HttpStatusCode.OK, "Product added successfully.") : Request.CreateResponse(HttpStatusCode.BadRequest, "Request failed");
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

        [HttpPut]
        public HttpResponseMessage UpdateProduct([FromBody]Product product)
        {
            try
            {
                bool result = ProductPL.Update(product);
                return result.Equals(true) ? Request.CreateResponse(HttpStatusCode.OK, "Product updated successfully") : Request.CreateResponse(HttpStatusCode.BadRequest, "Request failed");
            }
            catch (Exception ex)
            {
                ErrorHandler.WriteError(ex);
                var response = Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
                return response;
            }
        }

        [HttpGet]
        public HttpResponseMessage RetrieveProduct()
        {
            try
            {
                IEnumerable<Object> products = ProductPL.RetrieveProducts();
                object returnedProducts = new { data = products };
                return Request.CreateResponse(HttpStatusCode.OK, returnedProducts);
            }
            catch (Exception ex)
            {
                ErrorHandler.WriteError(ex);
                var response = Request.CreateResponse(HttpStatusCode.BadRequest);
                response.ReasonPhrase = ex.Message;
                return response;
            }
        }
    }
}
