//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace FoodStockLibrary.ModelLibrary.EntityFrameworkLib
{
    using System;
    using System.Collections.Generic;
    
    public partial class Product
    {
        public Product()
        {
            this.OrderItems = new HashSet<OrderItem>();
        }
    
        public long ID { get; set; }
        public Nullable<long> CategoryID { get; set; }
        public string Name { get; set; }
        public Nullable<long> Level { get; set; }
        public Nullable<long> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedOn { get; set; }
        public Nullable<long> LastUpdatedBy { get; set; }
        public Nullable<System.DateTime> LastUpdatedOn { get; set; }
        public string Status { get; set; }
    
        public virtual ICollection<OrderItem> OrderItems { get; set; }
        public virtual ProductCategory ProductCategory { get; set; }
        public virtual User User { get; set; }
        public virtual User User1 { get; set; }
    }
}
