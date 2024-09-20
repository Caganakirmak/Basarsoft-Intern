using Npgsql;
using System;
using System.Data;
using System.Collections.Generic;
using WebApplication3.Interfaces;
using WebApplication3.Controllers;
using WebApplication3.Models;
using Microsoft.EntityFrameworkCore;

namespace WebApplication3.Services
{
    public class PointService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PointService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Response<List<Point>> GetAll()
        {
            return _unitOfWork.Points.GetAll();
        }

        public Response<Point> GetById(long id)
        {
            return _unitOfWork.Points.GetById(id);
        }

        public Response<Point> Add(Point point)
        {
            var response = _unitOfWork.Points.Add(point);
            if (response.Status)
            {
                _unitOfWork.SaveChanges();
            }
            return response;
        }

        public Response<Point> Update(Point point)
        {
            var response = _unitOfWork.Points.Update(point);
            if (response.Status)
            {
                _unitOfWork.SaveChanges();
            }
            return response;
        }

        public Response<Point> Delete(long id)
        {
            var response = _unitOfWork.Points.Delete(id);
            if (response.Status)
            {
                _unitOfWork.SaveChanges();
            }
            return response;
        }
    }
}