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
                "username": String,
                "title": String,
                "description": String,
                "status": String,
                "upvote": Number,
                "downvote": Number,
                "createdAt": Date,
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

### 9. Add Complaint
- Method: `POST`
- URL Patterns: `/api/complaints`
- Authetication: `true`
- Params: `none`
- Body: 
  ```json
  {
  "title": String,
  "description": String
  }
  ```
- Usage:
  ```
  curl -X POST \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  URL_Patterns: /api/complaints/
  ```
- Response:
  - Success: (201)
    ```json
    {
    "message": "Aduan berhasil ditambahkan", 
    "complaint":
        {
          "_id": ObjectId,
          "userID": ObjectId,
          "title": String,
          "description": String,
          "status": String,
          "totalUpvotes": Number,
          "totalDownvotes": Number,
          "createdAt": Timestamps,
          "updatedAt": Timestamps
        }
    }
    ```
  - Errors: (400)
    ```json
    {
      "message": error.message
    }
    ```

### 10. Search Complaint
- Method: `GET`
- URL Patterns: `/api/complaints/search`
- Authetication: `false`
- Params: `title`
- Body: `none`
- Usage: `none`
- Response:
  - Success: (200)
    ```json
    {
    "username": String,
    "complaints": [
        {
            "complaint": {
                "_id": ObjectId,
                "userID": ObjectId,
                "title": String,
                "description": String,
                "status": String,
                "totalUpvotes": Number,
                "totalDownvotes": Number,
                "createdAt": Timestamps,
                "updatedAt": Timestamps
            },
            "feedback": {
                "is_upvote": Boolean,
                "is_downvote": Boolean
            }
        }
      ]
    }
    ```
  - Errors: (404)
    ```json
    {
      "message": "Complaints NOT Found."
    }
    ```

### 11. Detail Complaint
- Method: `GET`
- URL Patterns: `/api/complaints/:id`
- Authetication: `false`
- Params: `id`
- Body: `none`
- Usage: `none`
- Response:
  - Success: (200)
    ```json
    {
    "complaint": 
        {
          "_id": ObjectId,
          "userID": ObjectId,
          "title": String,
          "description": String,
          "status": String,
          "totalUpvotes": Number,
          "totalDownvotes": Number,
          "createdAt": Timestamps,
          "updatedAt": Timestamps
        },
        "isUserLoggedIn": Boolean,
        "userData": {
          "username": String,
          "is_upvote": Boolean,
          "is_downvote": Boolean,
        }
    }
    ```
  - Errors: (404)
    ```json
    {
      "message": "Complaints NOT Found."
    }
    ```

### 12. Update Complaint Status
- Method: `PUT`
- URL Patterns: `/api/complaints/:id/update-status`
- Authetication: `true`
- Params: `id`
- Body: 
  ```json
  {
  "status": String
  }
  ```
- Usage:
  ```
  curl -X PUT \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  URL_Patterns: /api/complaints/:id/update-status
  ```
- Response:
  - Success: (200)
    ```bash
    redirectUrl: `/api/complaints/:id`
    ```
  - Errors: (404)
    ```json
    {
      "message": error.message
    }
    ```
