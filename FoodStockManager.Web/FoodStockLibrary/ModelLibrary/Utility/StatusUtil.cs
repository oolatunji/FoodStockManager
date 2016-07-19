using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodStockLibrary
{
    public class StatusUtil
    {
        public enum OrderStatus
        {
            Requested,
            Approved,
            Delivered,
            Acknowledged,
            Cancelled,
            Declined
        }

        public enum Status
        {
            Active,
            InActive,
        }

        public static string GenerateOrderNumber()
        {
            var orderNumber = string.Empty;

            var today = System.DateTime.Now;
            var random = new Random();
            var rand = random.Next(1, 100);

            orderNumber = string.Format("TAF{0}{1}", rand.ToString().PadRight(3, '0'), String.Format("{0:dMyyyyHHmmss}", today));

            return orderNumber;
        }
    }
}
