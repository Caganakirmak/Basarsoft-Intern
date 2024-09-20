using System;
using System.Threading.Tasks;
using WebApplication3.Models;

namespace WebApplication3.Interfaces
{
    public interface IUnitOfWork
    {
        IGenericRepository<Point> Points { get; }
        Task<int> SaveChangesAsync();
        void SaveChanges();
    }
}
