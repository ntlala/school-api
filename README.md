# School API

A simple RESTful API to manage student records for a school, built with **Express.js** and **SQLite**.  
Includes a frontend served via Express static files for managing students with search, filter, and sorting features.

---

## Features

- Add, update, delete student records  
- Search students by name  
- Filter students by grade  
- Sort students by name (ascending)  
- Simple, clean frontend UI served by Express  
- Uses SQLite for lightweight data storage  
- Ready for deployment on Render.com with native module rebuild

---

## Technologies Used

- Node.js  
- Express.js  
- SQLite (better-sqlite3)  
- HTML/CSS/JavaScript (vanilla) for frontend

---

## Installation & Setup

1. Clone this repository:

```bash
git clone https://github.com/your-username/school-api.git
cd school-api

## Installation & Setup

1. Clone this repository:

```bash
git clone https://github.com/your-username/school-api.git
cd school-api
Install dependencies:

bash
Copy
Edit
npm install
Run the app locally:

bash
Copy
Edit
npm start
Open http://localhost:3000 in your browser to access the frontend.

# API Endpoints
Method	Endpoint	Description
GET	/students	Get all students (with search/filter/sort support via query params)
POST	/students	Add a new student
PATCH	/students/:id	Update an existing student
DELETE	/students/:id	Delete a student

Query parameters supported on GET /students:

name — search by student name (partial match)

grade — filter by grade (exact match)

Results are sorted by name ascending by default.

Deployment on Render.com
Remove node_modules and package-lock.json from your local repo:

bash
Copy
Edit
rm -rf node_modules package-lock.json
Add a postinstall script in package.json to rebuild native SQLite modules on deployment:

json
Copy
Edit
"scripts": {
  "start": "node server.js",
  "postinstall": "npm rebuild better-sqlite3"
}
Push your code to GitHub.

Create a new Web Service on Render:

Connect your GitHub repo.

Set build command: npm install

Set start command: npm start

Deploy.

Your app will be live and accessible via the URL Render provides.

Notes
SQLite database file (school.db) is stored in the project root and will persist on Render's disk storage.

For production and scalability, consider migrating to a more robust DB like PostgreSQL.

The frontend is served statically from the public directory.

License
MIT License © [Your Name]

Feel free to open issues or submit pull requests to improve this project!


