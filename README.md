# HeartBridge - A Dating Application

HeartBridge is a dating application designed to help users find connections and engage in real-time conversations. It includes key features such as user profiles, feed, connection requests, and a fully integrated chat system powered by Socket.io. This application is built using the MERN stack (MongoDB, Express.js, React, Node.js) with advanced features like JWT authentication, real-time communication, and validation.

## Features

- **User Authentication**: Secure login and signup with JWT token generation and cookie-based authentication.
- **User Profiles**: Create and edit user profiles with options to add personal details, photos, and more.
- **Feed**: Users can see others' profiles in the feed and send connection requests.
- **Connection Requests**: Send, accept, or reject connection requests from other users.
- **Real-time Chat**: Chat with other users in real-time using Socket.io.
- **Profile Editing**: Users can edit their profiles, including personal information and photos.
- **Forgot Password**: Password reset functionality with email validation.
- **Notifications**: Get notified when receiving a connection request or message.
- **API Endpoints**: A set of RESTful APIs for user authentication, profile management, connection requests, and more.

## Technologies Used

- **Frontend**: React.js, Vite, Tailwind CSS, Daisy UI, React Router, Redux Toolkit
- **Backend**: Node.js, Express.js, MongoDB (with Mongoose), JWT, Socket.io
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing, cookie-parser for cookie management
- **Real-time Communication**: Socket.io
- **Testing**: Postman for API testing

## Installation

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/HeartBridge.git
   cd HeartBridge/frontend

2. Install dependencies:
   ```bash 
      npm install

3. Start the frontend development server:
   ```bash
   npm run dev

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd HeartBridge/backend

2. Install dependencies:
   ```bash
   npm install

3. Create a .env file in the backend folder and add your environment variables:
   ```bash
   JWT_SECRET_KEY=your-secret-key
   DB_URI=mongodb://localhost:27017/heartBridge
   PORT=7777

4. Start the backend server:
   ```bash
   npm start

## API Documentation

### Auth Routes

- **POST/signup**: Register a new user.
- **POST/login**: Login with email and password, returns JWT token.
- **POST/logout**: Logout and clear the JWT token from cookies.

### Profile Routes

- **GET /profile/view**: View your profile.
- **PATCH /profile/edit**: View your profile.
- **PATCH /profile/password**: View your profile.


### Connection Request Routes

- **POST /request/send/:status/:userId**:  Send a connection request to another user with status (interested, rejected, ignored).
- **POST /request/review/:status/:requestId**: Review a received connection request.

### User Routes

- **GET /user/requests/received**
: Get all received connection requests.
- **GET /user/connections**: Get all accepted connections.
- **GET /user/feed**: 
 Get the list of users in the feed.

### Message Routes

- **POST/message/send**: Post all the msg to the DataBase.
- **POST/message/conversation**: Post all the msg to the user(Receiver). 

### Real-time Chat:
HeartBridge uses Socket.io to implement real-time chat. Once logged in, users can send and receive messages instantly. The system handles connections, message delivery, and displays chat notifications.


