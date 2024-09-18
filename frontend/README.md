# Career Compass

**Career Compass** is a comprehensive MERN stack application designed to simplify job searching and recruitment. Built with React, Vite, Express, Node.js, MongoDB, Firebase, and Redux, this platform allows users to search for job opportunities, apply for positions, and manage their applications efficiently. Recruiters and companies can post job listings and track applications seamlessly.

## Features

- **User Authentication**: Secure login and registration via email/password, JWT tokens, and Google OAuth.
- **Profile and Resume Management**: Store and manage user profiles and resumes using Firebase Storage.
- **Advanced Job Search**: Filter job listings based on experience level and job type.
- **Recruiter Dashboard**: Post job vacancies and manage applications from recruiters and companies.
- **Real-Time Performance**: Fast and reliable application for both job seekers and recruiters.

## Tech Stack

- **Frontend**: React, Vite, Redux
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Google OAuth, JWT token
- **Storage**: Firebase Storage

## Getting Started

### Prerequisites

- Node.js (>=14.x)
- MongoDB (Local or Cloud instance)
- Firebase Account

### Installation

1. **Clone the repository:**

    ```bash
    git clone [https://github.com/seeranjeeviramavel/career-compass](https://github.com/seeranjeeviramavel/careercompass).git
    cd career-compass
    ```

2. **Install frontend dependencies:**

    ```bash
    cd frontend
    npm install
    ```

3. **Install backend dependencies:**

    ```bash
    cd ../backend
    npm install
    ```

4. **Set up environment variables:**

    - Create a `.env` file in the `backend` directory and add your Firebase and MongoDB configuration:
    
      ```plaintext
      MONGO_URI=your_mongodb_connection_string
      FIREBASE_API_KEY=your_firebase_api_key
      FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
      FIREBASE_PROJECT_ID=your_firebase_project_id
      FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
      FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
      FIREBASE_APP_ID=your_firebase_app_id
      JWT_SECRET=your_jwt_secret
      ```

5. **Run the backend server:**

    ```bash
    cd ../backend
    npm start
    ```

6. **Run the frontend application:**

    ```bash
    cd ../frontend
    npm run dev
    ```

### Usage

- Navigate to `http://localhost:3000` to access the frontend application.
- The backend API will be available at `http://localhost:5000`.

### Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Contact

For any inquiries or issues, please reach out to [seeranjeeviramavel@gmail.com](mailto:seeranjeeviramavel@gmail.com).

