using FoodStockLibrary.ModelLibrary.EntityFrameworkLib;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodStockLibrary
{
    public class ProductDL
    {
        public static bool Save(Product product)
        {
            try
            {
                using (var context = new FoodStockDBEntities())
                {
                    context.Products.Add(product);
                    context.SaveChanges();
                }
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool ProductExists(Product product)
        {
            try
            {
                var existingProduct = new Product();
                using (var context = new FoodStockDBEntities())
                {
                    existingProduct = context.Products
                                    .Where(t => t.Name.Equals(product.Name))
                                    .FirstOrDefault();
                }

                if (existingProduct == null)
                    return false;
                else
                    return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<Product> RetrieveProducts()
        {
            try
            {
                using (var context = new FoodStockDBEntities())
                {
                    var products = context.Products
                                            .Include(p => p.ProductCategory)
                                            .Include(p => p.User)
                                            .Include(p => p.User1)
                                            .ToList();

                    return products;
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
                var existingProduct = new Product();
                using (var context = new FoodStockDBEntities())
                {
                    existingProduct = context.Products
                                    .Where(t => t.ID == product.ID)
                                    .FirstOrDefault();
                }

                if (existingProduct != null)
                {
                    existingProduct.CategoryID = product.CategoryID;
                    existingProduct.Name = product.Name;
                    existingProduct.Level = product.Level;
                    existingProduct.LastUpdatedBy = product.LastUpdatedBy;
                    existingProduct.LastUpdatedOn = System.DateTime.Now;

                    using (var context = new FoodStockDBEntities())
                    {
                        context.Entry(existingProduct).State = EntityState.Modified;

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
