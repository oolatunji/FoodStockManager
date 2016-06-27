using FoodStockLibrary.ModelLibrary.EntityFrameworkLib;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodStockLibrary
{
    public class ProductCategoryDL
    {
        public static bool Save(ProductCategory productCategory)
        {
            try
            {
                using (var context = new FoodStockDBEntities())
                {
                    context.ProductCategories.Add(productCategory);
                    context.SaveChanges();
                }
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool ProductCategoryExists(ProductCategory productCategory)
        {
            try
            {
                var existingProductCategory = new ProductCategory();
                using (var context = new FoodStockDBEntities())
                {
                    existingProductCategory = context.ProductCategories
                                    .Where(t => t.Name.Equals(productCategory.Name))
                                    .FirstOrDefault();
                }

                if (existingProductCategory == null)
                    return false;
                else
                    return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<ProductCategory> RetrieveProductCategory()
        {
            try
            {
                using (var context = new FoodStockDBEntities())
                {
                    var productCategory = context.ProductCategories
                                            .Include(pc => pc.User)
                                            .Include(pc => pc.User1)
                                            .ToList();

                    return productCategory;
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
                var existingProductCategory = new ProductCategory();
                using (var context = new FoodStockDBEntities())
                {
                    existingProductCategory = context.ProductCategories
                                    .Where(t => t.ID == productCategory.ID)
                                    .FirstOrDefault();
                }

                if (existingProductCategory != null)
                {
                    existingProductCategory.Name = productCategory.Name;
                    existingProductCategory.LastUpdatedBy = productCategory.LastUpdatedBy;
                    existingProductCategory.LastUpdatedOn = System.DateTime.Now;

                    using (var context = new FoodStockDBEntities())
                    {
                        context.Entry(existingProductCategory).State = EntityState.Modified;

                        context.SaveChanges();
                    }

                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
