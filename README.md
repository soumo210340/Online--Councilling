

# E Counselling

## Overview

**E Counselling** is a web application designed to assist students in finding eligible colleges based on their academic performance. The application allows users to register, log in, and view a list of colleges they qualify for based on their total marks. Administrators can add new colleges with various attributes through an admin panel.

## Features

- **User Registration and Login**
  - Students can sign up with their details and log in to access the home page.
  - Users can view their profile details on the home page.

- **Admin Panel**
  - Admins can add new colleges with attributes such as name, location, courses, established year, and marks range.

- **College Filtering**
  - The application filters colleges based on the student’s total marks to show only those colleges where the student’s marks fall within the minimum and maximum range specified for each college.

## Technologies Used

- **Frontend:** HTML, CSS, Handlebars
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Object Data Modeling (ODM):** Mongoose
- **Version Control:** Git

## File Structure

```
E COUNSELLING
│
├── models
│   ├── college.js         # Mongoose schema and model for the College collection
│   ├── login.js           # Mongoose schema and model for the User collection
│
├── node_modules
│   └── ...                # Node.js modules and dependencies
│
├── public
│   └── css
│       ├── admin.css      # CSS styles for the admin dashboard
│       ├── home.css       # CSS styles for the home page
│       ├── login.css      # CSS styles for the login page
│       └── signup.css     # CSS styles for the signup page
│
├── src
│   ├── addcollege.js      # Admin route to handle adding new colleges
│   ├── college.js         # Routes and logic related to colleges
│   ├── index.js           # Main entry file for the Express application
│   └── mongo.js           # MongoDB connection setup
│
├── templates
│   ├── home.hbs           # Handlebars template for the home page
│   ├── login.hbs          # Handlebars template for the login page
│   └── signup.hbs         # Handlebars template for the signup page
│
├── .gitignore
├── package-lock.json
├── package.json
└── README.md              # This file
```

## Installation

### Prerequisites

- **Node.js**: Make sure Node.js is installed. You can download it from [nodejs.org](https://nodejs.org/).
- **MongoDB**: Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community) or use a cloud MongoDB service.

### Clone the Repository

```bash
git clone https://github.com/your-username/e-counselling.git
cd e-counselling
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory of the project and add the following line to specify your MongoDB connection string:

```
MONGODB_URI=mongodb://localhost:27017/LoginFormPractice
```

### Run the Application

Start the MongoDB server (if using a local MongoDB instance):

```bash
mongod
```

Then, start the Node.js application:

```bash
npm start
```

You can now access the application at `http://localhost:3000`.

## Usage

### Accessing the Application

- **Login:** Go to `http://localhost:3000/login` to log in.
- **Signup:** Go to `http://localhost:3000/signup` to register a new user.
- **Admin Panel:** Go to `http://localhost:3000/admin` to access the admin panel for adding colleges.
- **Home Page:** After logging in, you will be redirected to `http://localhost:3000/home` where you can view eligible colleges.

### Adding a New College (Admin Panel)

1. Navigate to the admin panel at `http://localhost:3000/admin`.
2. Fill out the form with the college details:
   - **Name**: College name
   - **Location**: College location
   - **Courses**: List of available courses (comma-separated)
   - **Established Year**: Year the college was established
   - **Minimum Marks**: Minimum marks required for admission
   - **Maximum Marks**: Maximum marks allowed for admission
3. Submit the form to add the college to the database.

### Registering a New User

1. Navigate to the signup page at `http://localhost:3000/signup`.
2. Fill out the registration form with the following details:
   - **Name**: Full name of the user
   - **Email**: Email address
   - **Total Marks**: Total marks obtained by the user
   - **Passout Year**: Year of graduation
   - **Father’s Name**: Father’s name
   - **Password**: User’s password

### Logging In

1. Navigate to the login page at `http://localhost:3000/login`.
2. Enter your registered name and password to log in.

### Viewing Eligible Colleges

1. After logging in, you will be redirected to the home page at `http://localhost:3000/home`.
2. The page will display a list of colleges where your total marks fall within the specified `minMarks` and `maxMarks` range.

## API Endpoints

### POST `/signup`

- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "totalMarks": 85,
    "passoutYear": 2024,
    "fatherName": "Michael Doe",
    "password": "password123"
  }
  ```

### POST `/login`

- **Description:** Authenticate a user.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "password": "password123"
  }
  ```

### POST `/admin`

- **Description:** Add a new college.
- **Request Body:**
  ```json
  {
    "name": "ABC University",
    "location": "New York",
    "courses": "Computer Science, Mechanical Engineering",
    "establishedYear": 2000,
    "minMarks": 60,
    "maxMarks": 100
  }
  ```

### GET `/home`

- **Description:** Get the home page for the logged-in user and display eligible colleges.
- **Query Parameters:**
  - `userId`: User’s ID from the query string.

## Contribution Guidelines

We welcome contributions to the **E Counselling** project. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes.
4. Commit your changes and push to your branch.
5. Open a pull request with a description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any questions or issues, please contact:

- **Email:** [your-email@example.com](mailto:soumyadeepchatterjee545@gmail.com)
- **GitHub:** [your-github-profile](https://github.com/soumo210340)

## Acknowledgments

- [Express.js](https://expressjs.com/) for the web framework.
- [Mongoose](https://mongoosejs.com/) for MongoDB object modeling.
- [Handlebars](https://handlebarsjs.com/) for templating.

---

This README should give a detailed overview of your project, including setup instructions, features, and contact information. Feel free to adjust the contact details, licensing, or other specifics to better match your project’s requirements and your preferences.
