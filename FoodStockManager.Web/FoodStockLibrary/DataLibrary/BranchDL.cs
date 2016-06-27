﻿using FoodStockLibrary.ModelLibrary.EntityFrameworkLib;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FoodStockLibrary
{
    public class BranchDL
    {
        public BranchDL()
        {

        }

        public static bool Save(Branch branch)
        {
            try
            {                                
                using (var context = new FoodStockDBEntities())
                {
                    context.Branches.Add(branch);
                    context.SaveChanges();
                }
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool BranchExists(Branch branch)
        {
            try
            {
                var existingBranch = new Branch();
                using (var context = new FoodStockDBEntities())
                {
                    existingBranch = context.Branches
                                    .Include(b => b.Users)
                                    .Where(t => t.Name.Equals(branch.Name) || t.Code.Equals(branch.Code))
                                    .FirstOrDefault();
                }

                if (existingBranch == null)
                    return false;
                else
                    return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<Branch> RetrieveBranches()
        {
            try
            {
                using (var context = new FoodStockDBEntities())
                {
                    var branches = context.Branches
                                    .Include(b => b.Users)
                                    .ToList();

                    return branches;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static Branch RetrieveBranchByID(long? branchID)
        {
            try
            {
                using (var context = new FoodStockDBEntities())
                {
                    var branches = context.Branches
                                            .Include(b => b.Users)
                                            .Where(f => f.ID == branchID);

                    return branches.FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool Update(Branch branch)
        {
            try
            {
                Branch existingBranch = new Branch();
                using (var context = new FoodStockDBEntities())
                {
                    existingBranch = context.Branches
                                    .Include(b => b.Users)
                                    .Where(t => t.ID == branch.ID)
                                    .FirstOrDefault();
                }

                if (existingBranch != null)
                {
                    existingBranch.Name = branch.Name;
                    existingBranch.Code = branch.Code;
                    existingBranch.Address = branch.Address;

                    using (var context = new FoodStockDBEntities())
                    {
                        context.Entry(existingBranch).State = EntityState.Modified;

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
