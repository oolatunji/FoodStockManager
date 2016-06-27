using FoodStockLibrary.ModelLibrary.EntityFrameworkLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodStockLibrary
{
    public class ProductCategoryPL
    {
        public static bool Save(ProductCategory productCategory, out string message)
        {
            try
            {
                if (ProductCategoryDL.ProductCategoryExists(productCategory))
                {
                    message = string.Format("Product Category with name: {0} exists already", productCategory.Name);
                    return false;
                }
                else
                {
                    message = string.Empty;
                    return ProductCategoryDL.Save(productCategory);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool Update(ProductCategory productCategory)
        {
            try
            {
                return ProductCategoryDL.Update(productCategory);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<Object> RetrieveProductCategories()
        {
            try
            {
                List<Object> returnedProductCategories = new List<object>();

                List<ProductCategory> productCategories = ProductCategoryDL.RetrieveProductCategory();

                foreach (ProductCategory productCategory in productCategories)
                {
                    Object productCategoryObj = new
                    {
                        ID = productCategory.ID,
                        Name = productCategory.Name,
                        CreatedBy = productCategory.User != null ? productCategory.User.Username : string.Empty,
                        CreatedOn = productCategory.CreatedOn != null ? String.Format("{0:G}", productCategory.CreatedOn) : string.Empty,
                        LastUpdatedBy = productCategory.User1 != null ? productCategory.User1.Username : string.Empty,
                        LastUpdatedOn = productCategory.LastUpdatedOn != null ? String.Format("{0:G}", productCategory.LastUpdatedOn) : string.Empty,
                    };

                    returnedProductCategories.Add(productCategoryObj);
                }

                return returnedProductCategories;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
