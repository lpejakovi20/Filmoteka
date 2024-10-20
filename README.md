## Filmoteka

A movie web application project.

### Technologies
- HTML
- SCSS
- JavaScript
- TypeScript
- Angular
- Node.js
- Express.js
- SQLite

### Project Structure
- `server/`: Node.js backend implementation.
- `angular/`: Angular frontend application.

### Features

- **Authentication**: Users can log in and register for an account.
- **Session Management**: User information is maintained in session storage.
- **Data Operations**: 
  - Perform CRUD (Create, Read, Update, Delete) operations for genres sourced from TMDB and stored in a SQLite database.
  - Manage movies with similar CRUD operations, utilizing both TMDB and the SQLite database.
- **Movie Search**: Users can search for movies from TMDB, with results displayed in a table.
- **Dynamic Rendering**: The application features conditional rendering based on user interactions.

## Requirements

- **Node.js Version**: Ensure you have Node.js v18 installed.

## Usage Instructions

To start the application, follow these steps:

1. Navigate to the **`servis`** directory inside the server:
   ```bash
   cd servis
   npm start

2. Navigate to the **`aplikacija`** directory inside the server:
   ```bash
   cd ../aplikacija
   npm start

The application will run on port 4800.
