using FoodStockLibrary.ModelLibrary.EntityFrameworkLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodStockLibrary
{
    public class OrderDL
    {
        public static bool Save(Order order)
        {
            try
            {
                using (var context = new FoodStockDBEntities())
                {
                    context.Orders.Add(order);
                    context.SaveChanges();
                }
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
