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
- Create a new branch with the following naming convention: `<your-name>/<task>`
- Make your changes
- Push your changes to the branch you created
- Merge your branch into main

## API Documentation
### 1. Register User
- Method: `POST`
- URL Patterns: `/api/register`
- Authetication: `false`
- Body:
  ```json
  {
    "username": String,
    "email": String,
    "password": String
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
    ```json
    {
      "token": String
    }
    ```
  - Errors: (400)
    ```json
    {
      "message": "Email is already registered"
    }
    ```

### 2. Login User
- Method: `POST`
- URL Patterns: `/api/login`
- Authetication: `false`
- Body:
  ```json
  {
    "email": String,
    "password": String
  }
  ```
- Usage:
  ```
  curl -X POST \
  -d '{ "email": "email",
    "password": "password"}' \
  URL_Patterns
  ```
- Response:
  - Success: (200)
    ```json
    {
      "token": String
    }
    ```
  - Errors: (404)
    ```json
    {
      "message": "User not found"
    }
    ```

### 3. Update Password User
- Method: `POST`
- URL Patterns: `/api/update-password`
- Authetication: `true`
- Body:
  ```json
  {
    "oldPassword": String
    "newPassword": String
    "confirmPassword": String
  }
  ```
- Usage:
  ```
  curl -X POST \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
  -d '{ "oldPassword": "oldPassword",
    "newPassword": "newPassword",
    "confirmPassword": "confirmPassword"}' \
  URL_Patterns
  ```
- Response:
  - Success: (200)
    ```json
    {
      "message": "Password successfully updated"
    }
    ```
  - Errors: (401)
    ```json
    {
      "message": "Password not match"
    }
    ```

### 4. Profile User
- Method: `GET`
- URL Patterns: `/api/profile`
- Authetication: `true`
- Body: `none`
- Usage:
  ```
  curl -X GET \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  URL_Patterns
  ```
- Response:
  - Success: (200)
    ```json
    {
      "user":
        {
          "_id": ObjectId,
          "email": String,
          "username": String
        }
    }
    ```
  - Errors: (404)
    ```json
    {
      "message": "User not found"
    }
    ```

### 5. History Complaints User
- Method: `GET`
- URL Patterns: `/api/history`
- Authetication: `true`
- Body: `none`
- Usage:
  ```
  curl -X GET \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  URL_Patterns
  ```
- Response:
  - Success: (200)
    ```json
    {
        "complaints": [
            {
                "_id": ObjectId,
                "userID": ObjectId,
                "title": String,
                "description": String,
                "status": String,
                "totalUpvotes": Number,
                "totalDownvotes": Number,
                "createdAt": Date,
                "username": String,
            },
        ]
    }
    ```
  - Errors: (404)
    ```json
    {
      "message": "Complaint not found"
    }
    ```

### 6. Get All Complaints

This endpoint allows you to get a list of all the complaints that have been submitted by the users. You can use the GET method to request this endpoint without any authentication or body parameters.

- Method: `GET`
- URL Patterns: `/api/complaints/`
- Authetication: `false`
- Body: `none`
- Usage:

```bash
curl -X GET URL Patterns
```

- Response:
  - Success: (200)
    ```json
    {
        "complaints": [
            {
                "_id": ObjectId,
                "title": String,
                "description": String,
                "keterangan": String,
                "username": String,
                "upvotes": Number,
                "downvotes": Number,
                "vote_flag" : String
            },
            // more complaints ...
        ]
    }
    ```
  - Errors: (500)
    ```json
    { 
        "error": "Internal server error" 
    }
    ```

### 7. Upvote Complaint
- Method: `PUT`
- URL Patterns: `/api/upvote/:complaintID`
- Authetication: `true`
- Body: `none`
- Usage:
  ```
  curl -X PUT \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  URL_Patterns
  ```
- Response:
  - Success: (200)
    ```json
    {
      "totalUpvotes": Number
    }
    ```
  - Errors: (409)
    ```json
    {
      "message": "User already voted"
    }
    ```

### 8. Downvote Complaint
- Method: `PUT`
- URL Patterns: `/api/downvote/:complaintID`
- Authetication: `true`
- Body: `none`
- Usage:
  ```
  curl -X PUT \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  URL_Patterns
  ```
- Response:
  - Success: (200)
    ```json
    {
      "totalDownvotes": Number
    }
    ```
  - Errors: (409)
    ```json
    {
      "message": "User already voted"
    }
    ```
