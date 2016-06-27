using FoodStockLibrary.ModelLibrary.EntityFrameworkLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodStockLibrary
{
    public class ProductPL
    {
        public static bool Save(Product product, out string message)
        {
            try
            {
                if (ProductDL.ProductExists(product))
                {
                    message = string.Format("Product with name: {0} exists already", product.Name);
                    return false;
                }
                else
                {
                    message = string.Empty;
                    return ProductDL.Save(product);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool Update(Product product)
        {
            try
            {
                return ProductDL.Update(product);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<Object> RetrieveProducts()
        {
            try
            {
                List<Object> returnedProducts = new List<object>();

                List<Product> products = ProductDL.RetrieveProducts();

                foreach (Product product in products)
                {
                    Object productCategoryObj = new
                    {
                        ID = product.ID,
                        ProductCategoryName = product.ProductCategory.Name,
                        ProductCategoryID = product.ProductCategory.ID,
                        Name = product.Name,
                        Level = product.Level,
                        CreatedBy = product.User != null ? product.User.Username : string.Empty,
                        CreatedOn = product.CreatedOn != null ? String.Format("{0:G}", product.CreatedOn) : string.Empty,
                        LastUpdatedBy = product.User1 != null ? product.User1.Username : string.Empty,
                        LastUpdatedOn = product.LastUpdatedOn != null ? String.Format("{0:G}", product.LastUpdatedOn) : string.Empty,
                    };

                    returnedProducts.Add(productCategoryObj);
                }

                return returnedProducts;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
