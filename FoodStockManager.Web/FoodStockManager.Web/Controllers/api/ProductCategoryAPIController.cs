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
    public class ProductCategoryAPIController : ApiController
    {
        [HttpPost]
        public HttpResponseMessage SaveProductCategory([FromBody]ProductCategory productCategory)
        {
            try
            {
                string errMsg = string.Empty;
                productCategory.Status = StatusUtil.Status.Active.ToString();
                productCategory.CreatedOn = System.DateTime.Now;

                bool result = ProductCategoryPL.Save(productCategory, out errMsg);
                if (string.IsNullOrEmpty(errMsg))
                    return result.Equals(true) ? Request.CreateResponse(HttpStatusCode.OK, "Product category added successfully.") : Request.CreateResponse(HttpStatusCode.BadRequest, "Request failed");
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
        public HttpResponseMessage UpdateProductCategory([FromBody]ProductCategory productCategory)
        {
            try
            {
                bool result = ProductCategoryPL.Update(productCategory);
                return result.Equals(true) ? Request.CreateResponse(HttpStatusCode.OK, "Product category updated successfully") : Request.CreateResponse(HttpStatusCode.BadRequest, "Request failed");
            }
            catch (Exception ex)
            {
                ErrorHandler.WriteError(ex);
                var response = Request.CreateResponse(HttpStatusCode.BadRequest, ex.Message);
                return response;
            }
        }

        [HttpGet]
        public HttpResponseMessage RetrieveProductCategory()
        {
            try
            {
                IEnumerable<Object> productCategory = ProductCategoryPL.RetrieveProductCategories();
                object returnedProductCategory = new { data = productCategory };
                return Request.CreateResponse(HttpStatusCode.OK, returnedProductCategory);
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
