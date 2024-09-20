using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using WebApplication3.Interfaces;
using WebApplication3.Models;

namespace WebApplication3.Services
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly MyDbContext _context;
        private readonly DbSet<T> _dbSet;

        public GenericRepository(MyDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }

        public Response<List<T>> GetAll()
        {
            try
            {
                var entities = _dbSet.ToList();
                return new Response<List<T>>(true, $"{typeof(T).Name}s retrieved successfully.", entities);
            }
            catch (Exception ex)
            {
                return new Response<List<T>>(false, $"An error occurred: {ex.Message}", null);
            }
        }

        public Response<T> GetById(long id)
        {
            try
            {
                var entity = _dbSet.Find(id);
                if (entity == null)
                {
                    return new Response<T>(false, $"{typeof(T).Name} not found.", null);
                }
                return new Response<T>(true, $"{typeof(T).Name} retrieved successfully.", entity);
            }
            catch (Exception ex)
            {
                return new Response<T>(false, $"An error occurred: {ex.Message}", null);
            }
        }

        public Response<T> Add(T entity)
        {
            try
            {
                _dbSet.Add(entity);
                return new Response<T>(true, $"{typeof(T).Name} added successfully.", entity);
            }
            catch (Exception ex)
            {
                return new Response<T>(false, $"An error occurred: {ex.Message}", null);
            }
        }

        public Response<T> Update(T entity)
        {
            try
            {
                _dbSet.Update(entity);
                return new Response<T>(true, $"{typeof(T).Name} updated successfully.", entity);
            }
            catch (Exception ex)
            {
                return new Response<T>(false, $"An error occurred: {ex.Message}", null);
            }
        }

        public Response<T> Delete(long id)
        {
            try
            {
                var entity = _dbSet.Find(id);
                if (entity == null)
                {
                    return new Response<T>(false, $"{typeof(T).Name} not found.", null);
                }

                _dbSet.Remove(entity);
                return new Response<T>(true, $"{typeof(T).Name} deleted successfully.", null);
            }
            catch (Exception ex)
            {
                return new Response<T>(false, $"An error occurred: {ex.Message}", null);
            }
        }
    }
}
