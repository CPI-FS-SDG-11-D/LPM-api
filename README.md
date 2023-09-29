# LPM-api
HTTP Rest API backend Layanan Pengaduan Masyarakat Application with Node js and Express js.

How to setup local code program:
- Clone this repository
- Rename .envExample to .env and fill in the section that must be filled
- Run this command to instal dependencies:
```
npm install
```
- Run this command to start the server:
```
npm run start
```

## How to Contribute
- Create a new branch with the following naming convention: <your-name>/<feature-name>
- Make your changes
- Push your changes to the branch you created
- Create a pull request to merge your branch into main

## API Documentation
### 1. Register User
- Method: `POST`
- URL Patterns: `/api/register`
- Authetication: `false`
- Body:
  ```
  {
    username: String,
    email: String,
    password: String
  }
  ```
- Usage:
  ```
  curl -X POST \
  -d '{ "username": "username",
    "email": "email", 
    "password": "password"}' \
  URL_Patterns
  ```
- Response:
  - Success: (200)
    ```
    {
      "token": String
    }
    ```
  - Errors: (400)
    ```
    {
      "message": "Email is already registered"
    }
    ```

### 2. Login User
- Method: `POST`
- URL Patterns: `/api/login`
- Authetication: `false`
- Body:
  ```
  {
    username: String,
    password: String
  }
  ```
- Usage:
  ```
  curl -X POST \
  -d '{ "username": "username",
    "password": "password"}' \
  URL_Patterns
  ```
- Response:
  - Success: (200)
    ```
    {
      "token": String
    }
    ```
  - Errors: (404)
    ```
    {
      "message": "User not found"
    }
    ```

### 3. Profile User
- Method: `GET`
- URL Patterns: `/api/profile`
- Authetication: `true`
- Body: `none`
- Usage:
  ```
  curl -X GET URL_Patterns
  ```
- Response:
  - Success: (200)
    ```
    {
      "user":
        {
          _id: ObjectId,
          email: String,
          username: String
        }
    }
    ```
  - Errors: (404)
    ```
    {
      "message": "User not found"
    }
    ```
