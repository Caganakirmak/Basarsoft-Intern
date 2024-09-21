# Basarsoft Intern Project (EN)

This project is a **web application** developed during my internship at Başarsoft. It allows users to add, update, delete, and query points on a map. The backend is built using **ASP.NET Core** and **C#**, while the frontend is developed using **HTML**, **CSS**, **JavaScript**, and **OpenLayers** for the interactive map. The application uses **PostgreSQL** as the database.

## Project Overview

The application enables users to interact with a map by adding points, updating existing ones, and deleting them. Additionally, users can query and display points in a table format. The backend performs CRUD operations, while the frontend provides an interactive map interface.

### Key Features
- Add points on the map
- Update and delete added points
- View the coordinates of points
- Query and display data in a table format
- Database operations using PostgreSQL with Entity Framework Core
- Interactive map display using OpenLayers in the frontend

## Technologies Used

### Backend:
- **ASP.NET Core**: For building the Web API
- **Entity Framework Core**: For database interaction (PostgreSQL)
- **PostgreSQL**: The database system used

### Frontend:
- **HTML, CSS, JavaScript**: Core frontend technologies
- **OpenLayers**: For map functionality
- **DataTables**: For displaying queried data in a table

## Installation Steps

### 1. Backend
1. Clone this repository:
   ```bash
   git clone "https://github.com/Caganakirmak/Basarsoft-Intern.git"

2. Update the database connection settings:
   Configure the appsettings.json file with your PostgreSQL connection details:
   ```json
   "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=database;Username=postgres;Password=12345678"
   }
3. Install the required packages:
   ```bash
   dotnet restore
4. Run the database migrations:
   ```bash
   dotnet ef database update
5. Start the project
   ```bash
   dotnet run
### 2. Frontend
To run the frontend
   - Open the index.html file in your browser.
   - Interact with the map to add, update, delete, and query points.
### Usage
Add Point: Click the "Add Point" button, then click on the map to select a location. A panel will appear where you can enter details and save the point.
Query Points: Click the "Query" button to display all points in a table format. You can update or delete points directly from the table.
   - Update Point: Click the "Update" button to modify an existing point on the map.
   - Delete Point: Click the "Delete" button to remove a point from the map.
   - Show Point: Click the "Show" button to zoom an existing point on the map.
Toggle Day/Night: Click the button to switch the map to day and night mode.
