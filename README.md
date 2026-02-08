🎵 RADAR - Music Discovery & Management Platform
RADAR is a full-featured music discovery platform designed to provide users with an immersive listening and interactive experience. The project adopts a classic Spotify-inspired dark theme design and implements a complete backend system covering user authentication, music exploration, and playlist management.
🚀 Live Demo: https://radar-music-app.onrender.com

✨ Core Features
👤 User Experience

Personalized Homepage: Automatically shuffles and displays music cards from different genres (Pop, Rock, Hip-Hop, etc.)
Music Playback & Details: Interactive modal popups display song information with real-time playback support
Playlist System (Library): Users can create multiple personal playlists with "Add to Playlist" and "Remove from Playlist" functionality
Reviews & Ratings: Users can post text reviews and star ratings for their favorite songs, with real-time rendering of latest comments

🛡️ Admin Control

Song Management: Admins have exclusive permissions to upload new songs directly through URL (title, artist, cover art, audio source)
Content Moderation: Admins can delete inappropriate songs or any user's reviews with one click to maintain community standards
Data Authorization: Strict JWT role validation prevents unauthorized access to admin endpoints


🛠️ Tech Stack
Backend: Node.js & Express.js
Database: MongoDB Atlas (with Mongoose ODM)
Frontend: EJS Template Engine, Vanilla JavaScript, CSS3 (Responsive Design)
Security & Authentication:

JWT (JSON Web Token): Enables persistent cross-page login and state validation
Bcrypt: Salted hash encryption for user passwords

Deployment Platform: Render

📂 Project Structure
.
├── controllers/          # Core business logic (songs, reviews, playlists, users)
├── middleware/           # Authorization middleware (Auth, Admin validation)
├── models/               # MongoDB data models (Song, User, Playlist, Review)
├── routes/               # API route definitions
├── public/               # Static assets (CSS, Client JS, Images)
├── views/                # EJS page templates
├── server.js             # Application entry point
└── .env                  # Environment variables (database connection, secrets)

⚙️ Local Development Setup
1. Clone the Repository
bashgit clone https://github.com/Talantt0906/back_end_final_project.git
cd back_end_final_project
2. Install Dependencies
bashnpm install
3. Configure Environment Variables
Create a .env file in the root directory with the following content:
envMONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
4. Start the Application
bashnpm start
The application will be available at http://localhost:5000

🎯 Project Highlights
This project serves as a backend development final course project, demonstrating in-depth understanding of RESTful API design, relational data modeling (Mongoose Populate), and asynchronous frontend-backend communication (Fetch API).
Core Highlights:

Data Relationships: Implemented complex associations between playlists and songs, songs and reviews using ObjectId references
Error Handling: Comprehensive error interception mechanisms on both frontend and backend to prevent crashes from missing data
UI/UX: Meticulously recreated the visual and interactive experience of a dark-themed music player


🔒 Security Implementation

Password Encryption: All user passwords are hashed using bcrypt with salt rounds
JWT Authentication: Secure token-based authentication for protected routes
Role-Based Access Control (RBAC): Middleware ensures only authorized users can access specific endpoints
Input Validation: Server-side validation prevents SQL injection and XSS attacks
Environment Variables: Sensitive data stored securely in .env file


🚀 Deployment
The project is deployed on Render with the following configuration:

Backend: Node.js/Express server deployed on Render
Database: MongoDB Atlas cloud database
Environment: Production environment variables configured in Render dashboard

Deployment Steps

Push code to GitHub repository
Connect GitHub repository to Render
Configure environment variables in Render
Deploy with automatic builds on push


🧪 Testing
A complete Postman Collection is provided for testing all production endpoints.

📖 Project Requirements Compliance
This project fulfills all requirements outlined in the Final Project specification:
✅ Advanced Backend Completion

Full logic implementation for all required endpoints
Relational integrity between Users, Playlists, Songs, and Reviews
Advanced RBAC middleware for admin vs. user permissions

✅ Frontend Integration

Complete authentication flow with JWT storage
State management using vanilla JavaScript
Responsive design across all screen sizes

✅ Deployment & Production

Backend deployed on Render
Frontend served via EJS templates from Express
Public URL accessible

✅ Code Quality

Clean MVC structure
Comprehensive error handling
Secure data validation
