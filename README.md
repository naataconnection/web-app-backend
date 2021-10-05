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
    - /register - Send user info to register. Body should contain firstName, middleName, lastName, emailId, contact & role.
    - /registerDriver - Will register driver with their details which is visible in the dashbaord.
    - /registerManager - Will register manager with their details which is visible in the dashbaord.
    - /registerDeliveryBoy - Will register deliveryBoy with their details which is visible in the dashbaord.
    - /registerCustomer - Will register customer with their details which is visible in the dashbaord.
    - /login_checkUserAndSendOtp - Will check if user has registered and generate a new OTP for a particular user and send it to the email id or contact number.
    - /login_verifyOtp - Will verify otp and login user.
    - /logout - User will be logged out
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
- /attendance
  - /addUserList - Will populate the attendance database from userList
  - /markPresent - Will mark the respective user present with updating the locaion, startTime
  - /endtheDay - Will update the end time of the user
  - /getReportByDateAndUserCode - Will give the data for range of date of particular user
  - /getReportByDate - Will give data for range of date which will added in the dashbard
  - /clearDashboard - Will clean the dashbaord
- /superUser
  - /registerSuperUser - Send superUser info to register. Body should contain firstName, middleName, lastName, emailId, contact & role.
  - /login_checkSuperUserAndSendOtp - Will check if super user has registered and to generate a new OTP for a particular super user and send it to the email id or contact number.
  - /login_verifyOtp - Will verify otp and login super user
  - /logout - superUser will be logged out
- /block
  - /user - Will block the user
  - /superUser - Will block the SuperUser
- /users
  - /userList - Will get the user firstName, middleName, lastName and userCode
