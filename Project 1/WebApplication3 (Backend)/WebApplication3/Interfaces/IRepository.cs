using WebApplication3.Models;
using WebApplication3.Interfaces;

namespace WebApplication3.Interfaces
{
    public interface IRepository<Point> where Point : class
    {
        Response<List<Point>> GetAll();
        Response<Point> GetById(long id);
        Response<Point> Add(Point point);
        Response<Point> Update(Point point);
        Response<Point> Delete(long id);
    }
}