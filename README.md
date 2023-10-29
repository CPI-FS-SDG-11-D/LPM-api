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
          "username": String,
          "urlUser": String,
        }
    }
    ```
  - Errors: (404)
    ```json
    {
      "message": "User not found"
    }
    ```
    
### 5. Upload Profile Image User
- Method: `POST`
- URL Patterns: `/api/upload-user`
- Authetication: `true`
- Headers:
  ``` json
    {
      "Content-Type": multipart/form-data
    }
  ```
- Body:
    ``` json
    {
      "image": image (type=file, max=2mb)
    }
  ```
- Usage:
  ```
  curl -X GET \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
  -H "Content-Type: multipart/form-data" \
  -d '{ "image": image }' \
  URL_Patterns
  ```
- Response:
  - Success: (200)
    ```json
    {
      "urlUser": String
    }
    ```
  - Errors: (500)
    ```json
    {
      "message": "Error uploading image"
    }
    ```

### 6. History Complaints User
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
                "title": String,
                "status": String,
                "totalUpvotes": Number,
                "totalDownvotes": Number,
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

### 7. Get All Complaints

This endpoint allows you to get a list of all the complaints that have been submitted by the users.

- Method: `GET`
- URL Patterns: `/api/complaints?page=2&limit=3`
- Authentication: `true`, but guest user can pass
- Body: `none`
- Query: `page`, `limit`. Default value are `page=1` and `limit=5` 
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
          "username": String,
          "urlUser": String,
          "complaint": {
              "_id": ObjectId,
              "userID": ObjectId,
              "title": String,
              "description": String,
              "status": String,
              "totalUpvotes": Number,
              "totalDownvotes": Number,
              "createdAt": Timestamps,
              "updatedAt": Timestamps,
              "urlComplaint": String,
            },
          "feedback": {
              "is_upvote": Boolean,
              "is_downvote": Boolean
            }
        },
        //More Complaint...
      ]
    }
    ```
  - Errors: (500)
    ```json
    { 
        "error": "Internal server error" 
    }
    ```

### 8. Add Complaint
- Method: `POST`
- URL Patterns: `/api/complaints`
- Authetication: `true`
- Params: `none`
- Body: 
  ```json
  {
  "title": String,
  "description": String
  "urlComplaint": String
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
    "message": "Complaint added successfully", 
    "complaint":
        {
          "_id": ObjectId,
          "userID": ObjectId,
          "title": String,
          "description": String,
          "status": String,
          "totalUpvotes": Number,
          "totalDownvotes": Number,
          "urlComplaint": String,
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

### 9. Upload Image Complaint
- Method: `POST`
- URL Patterns: `/api/upload-complaint`
- Authetication: `true`
- Headers:
  ``` json
    {
      "Content-Type": multipart/form-data
    }
  ```
- Body:
    ``` json
    {
      "image": image (type=file, max=2mb)
    }
  ```
- Usage:
  ```
  curl -X GET \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
  -H "Content-Type: multipart/form-data" \
  -d '{ "image": image }' \
  URL_Patterns
  ```
- Response:
  - Success: (200)
    ```json
    {
      "urlComplaint": String
    }
    ```
  - Errors: (500)
    ```json
    {
      "message": "Error uploading image"
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
    [
      {
      "username": String,
      "urlUser": String,
      "complaint": {
          "_id": ObjectId,
          "userID": ObjectId,
          "title": String,
          "description": String,
          "status": String,
          "totalUpvotes": Number,
          "totalDownvotes": Number,
          "createdAt": Timestamps,
          "urlComplaint": String,
        },
      "feedback": {
          "is_upvote": Boolean,
          "is_downvote": Boolean
        }
      },
      //More Complaint...
    ]
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
      "username": String,
      "urlUser": String,
      "complaint": {
          "_id": ObjectId,
          "userID": ObjectId,
          "title": String,
          "description": String,
          "status": String,
          "totalUpvotes": Number,
          "totalDownvotes": Number,
          "createdAt": Timestamps,
          "urlComplaint": String,
        },
      "isComplaintOwner": Boolean,
      "feedback": {
          "is_upvote": Boolean,
          "is_downvote": Boolean
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
  "status": String ("pending"/"in progress"/"resolved")
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
    ```json
    {
      "message": "Complaint updated successfully"
    }
    ```
  - Errors: (404)
    ```json
    {
      "message": error.message
    }
    ```

### 13. Delete Complaint
- Method: `DELETE`
- URL Patterns: `/api/complaints/:id`
- Authetication: `true`
- Params: `id`
- Body: `none`
- Usage:
  ```
  curl -X PUT \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  URL_Patterns: /api/complaints/:id
  ```
- Response:
  - Success: (200)
    ```json
    {
      "message": "Complaint deleted successfully"
    }
    ```
  - Errors: (404)
    ```json
    {
      "message": error.message
    }
    ```

### 14. Upvote Complaint
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

### 15. Downvote Complaint
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
### 16. Get Viral Complaints

- Method: `GET`
- URL Patterns: `/api/complaints/viral
- Authentication: `false`
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
                "totalUpvotes": Number,
            },
            // more viral complaints ...
        ]
    }
    ```
  - Errors: (500)
    ```json
    { 
        "error": "Internal server error" 
    }
    ```
