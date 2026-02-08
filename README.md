# 🎵 RADAR - Music Discovery & Management Platform

RADAR is a full-featured music discovery platform designed to provide users with an immersive listening and interactive experience. The project adopts a classic Spotify-inspired dark theme design and implements a complete backend system covering user authentication, music exploration, and playlist management.

🚀 **Live Demo**: https://radar-music-app.onrender.com

## ✨ Core Features

### 👤 User Experience

- **Personalized Homepage**: Automatically shuffles and displays music cards from different genres (Pop, Rock, Hip-Hop, etc.)
- **Music Playback & Details**: Interactive modal popups display song information with real-time playback support
- **Playlist System (Library)**: Users can create multiple personal playlists with "Add to Playlist" and "Remove from Playlist" functionality
- **Reviews & Ratings**: Users can post text reviews and star ratings for their favorite songs, with real-time rendering of latest comments

### 🛡️ Admin Control

- **Song Management**: Admins have exclusive permissions to upload new songs directly through URL (title, artist, cover art, audio source)
- **Content Moderation**: Admins can delete inappropriate songs or any user's reviews with one click to maintain community standards
- **Data Authorization**: Strict JWT role validation prevents unauthorized access to admin endpoints

## 🛠️ Tech Stack

- **Backend**: Node.js & Express.js  
- **Database**: MongoDB Atlas (with Mongoose ODM)  
- **Frontend**: EJS Template Engine, Vanilla JavaScript, CSS3 (Responsive Design)  
- **Security & Authentication**:
  - JWT (JSON Web Token): Enables persistent cross-page login and state validation
  - Bcrypt: Salted hash encryption for user passwords
- **Deployment Platform**: Render


## 📂 Project Structure

```
.
├── controllers/          # Core business logic (songs, reviews, playlists, users)
├── middleware/           # Authorization middleware (Auth, Admin validation)
├── models/               # MongoDB data models (Song, User, Playlist, Review)
├── routes/               # API route definitions
├── public/               # Static assets (CSS, Client JS, Images)
├── views/                # EJS page templates
├── server.js             # Application entry point
└── .env                  # Environment variables (database connection, secrets)
```

## ⚙️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Talantt0906/back_end_final_project.git
cd back_end_final_project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### 4. Start the Application

```bash
npm start
```

The application will be available at `http://localhost:5000`

## 🎯 Project Highlights

This project serves as a backend development final course project, demonstrating in-depth understanding of **RESTful API design**, **relational data modeling (Mongoose Populate)**, and **asynchronous frontend-backend communication (Fetch API)**.

### Core Highlights:

- **Data Relationships**: Implemented complex associations between playlists and songs, songs and reviews using `ObjectId` references
- **Error Handling**: Comprehensive error interception mechanisms on both frontend and backend to prevent crashes from missing data
- **UI/UX**: Meticulously recreated the visual and interactive experience of a dark-themed music player

## 🔒 Security Implementation

- **Password Encryption**: All user passwords are hashed using bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication for protected routes
- **Role-Based Access Control (RBAC)**: Middleware ensures only authorized users can access specific endpoints
- **Input Validation**: Server-side validation prevents SQL injection and XSS attacks
- **Environment Variables**: Sensitive data stored securely in `.env` file

## 🚀 Deployment

The project is deployed on **Render** with the following configuration:

- **Backend**: Node.js/Express server deployed on Render
- **Database**: MongoDB Atlas cloud database
- **Environment**: Production environment variables configured in Render dashboard

### Deployment Steps

1. Push code to GitHub repository
2. Connect GitHub repository to Render
3. Configure environment variables in Render
4. Deploy with automatic builds on push

## 🧪 Testing

A complete **Postman Collection** is provided for testing all production endpoints.

## 📖 Project Requirements Compliance

This project fulfills all requirements outlined in the Final Project specification:

**✅ Advanced Backend Completion**
- Full logic implementation for all required endpoints
- Relational integrity between Users, Playlists, Songs, and Reviews
- Advanced RBAC middleware for admin vs. user permissions

**✅ Frontend Integration**
- Complete authentication flow with JWT storage
- State management using vanilla JavaScript
- Responsive design across all screen sizes

**✅ Deployment & Production**
- Backend deployed on Render
- Frontend served via EJS templates from Express
- Public URL accessible

**✅ Code Quality**
- Clean MVC structure
- Comprehensive error handling
- Secure data validation


## 👥 Contributors

**Developer**: [Your Name]  
**Course**: Web Technologies 2  
**Institution**: [Your University]  
**Semester**: [Term/Year]

## 📄 License

This project is developed for educational purposes as part of a university course assignment.

## 🙏 Acknowledgments

- Design inspiration from Spotify
- MongoDB Atlas for database hosting
- Render for deployment platform
- Course instructors and teaching assistants for guidance

## 📞 Contact

For questions or feedback regarding this project:

- **GitHub**: [@Talantt0906](https://github.com/Talantt0906)
- **Email**: [Your Email]

---

**Made with ❤️ for Web Technologies 2 Final Project**
