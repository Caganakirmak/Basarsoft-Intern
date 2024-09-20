using System.Collections.Generic;

namespace WebApplication3.Interfaces
{
    public interface IGenericRepository<T> where T : class
    {
        Response<List<T>> GetAll();
        Response<T> GetById(long id);
        Response<T> Add(T entity);
        Response<T> Update(T entity);
        Response<T> Delete(long id);
    }
}
