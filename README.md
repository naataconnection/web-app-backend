# Naata Connection Web App

### Table of Content

- [Naata Connection Web App](#naata-connection-web-app)
    - [Table of Content](#table-of-content)
  - [About](#about)
  - [Technology Used](#technology-used)
  - [Prerequisites](#prerequisites)
  - [Usage](#usage)
  - [Requests](#requests)

## About

## Technology Used
1. [Node.js](https://nodejs.org/en/) - v16.6.0
2. [MongoDB](https://www.mongodb.com/) - v5.0.1

## Prerequisites
1. npm
   ```bash
    npm install npm@latest -g
   ```
2. nodemon
   ```bash
    npm install nodemon -g
   ```

## Usage
1. Clone the repository
   ```bash
    git clone https://github.com/naataconnection/web-app-backend.git
   ```

2. Change the directory
   ```bash
    cd web-app-backend
   ```

3. Install Package
   ```bash
    npm install
   ```

4. Running the server
   ```bash
    npm start
   ```

## Requests

- /user
    - /register - Send user info to register. Body should contain firstName, middleName, lastName, password, emailId, contact & employeeCode.
    - /login - Send user through JWT.
    - /logout - User will be logged out
    - /verify - Verify user and token.
- /otp
  - / - Get will give list of all opts
  - /noUser - Generate a new OTP without connecting it with user
  - /generate - Generate a new OTP with connecting it with a user through user contact in request body.
- /email
  - /response - Will Send a verification email to recieverEmail in body.
  - /send - Will send verification email with OTP to email id in request body
  - /verify - Will verify Email ID and OTP of user
- /genericContact
  - /create 
- /vendorContact
  - /create 