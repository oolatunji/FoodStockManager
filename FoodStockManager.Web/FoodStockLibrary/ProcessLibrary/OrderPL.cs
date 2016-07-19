using FoodStockLibrary.ModelLibrary.EntityFrameworkLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodStockLibrary
{
    public class OrderPL
    {
        public static bool Save(Order order)
        {
            try
            {
                return OrderDL.Save(order);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
