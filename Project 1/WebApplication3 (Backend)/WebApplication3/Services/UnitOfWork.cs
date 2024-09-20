using System.Threading.Tasks;
using WebApplication3.Interfaces;
using WebApplication3.Models;

namespace WebApplication3.Services
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly MyDbContext _context;
        private IGenericRepository<Point> _points;

        public UnitOfWork(MyDbContext context)
        {
            _context = context;
        }

        public IGenericRepository<Point> Points
        {
            get
            {
                if (_points == null)
                {
                    _points = new GenericRepository<Point>(_context);
                }
                return _points;
            }
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}
