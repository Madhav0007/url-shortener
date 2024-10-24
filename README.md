# URL Shortener

A simple and user-friendly URL shortener application that allows users to shorten long URLs, track their usage, generate QR codes, and set expiration dates for shortened links. The application is designed with a clean interface and supports advanced features to enhance the user experience.

## Features

- **URL Shortening**: Easily convert long URLs into short, manageable links.
- **Redirection**: Redirect users from the shortened link to the original URL.
- **URL Tracking**: Monitor the number of clicks and other analytics for each shortened URL.
- **QR Code Generation**: Generate QR codes for shortened URLs for easy sharing.
- **Expiration**: Set expiration dates for shortened links, allowing automatic deletion after a specified period.
- **Password Protection**: Secure your links with a password, restricting access to only those who know it.

## Tech Stack

- **Frontend**: 
  - HTML
  - CSS
  - JavaScript
  - Bootstrap
  - React

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB

## How to Run the Application


### Prerequisites

- Node.js (version >= 14)
- MongoDB (or a MongoDB Atlas account)

### Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Madhav0007/url-shortener/ 
   cd url-shortener

2. **Setup Backend:**
    Navigate to the backend directory:
   ```bash
    cd backend

Create a .env file in the backend directory and set your MongoDB connection string:

Start the backend server
   ```bash
    npm start
```

3.**Setup Frontend:**
    Navigate to the frontend directory:
  ```bash
    cd ../frontend
```

4.**Access the application:**:
    Open your browser and go to http://localhost:3000 to access the URL shortener application.
