# LPM-api
HTTP Rest API backend Layanan Pengaduan Masyarakat Application with Node js and Express js.

## How to setup local code program:
- Clone this repository
- Run this command to instal dependencies:
```
npm install
```
- Run this command to pull .env file
```
npx dotenv-vault@latest pull
```
- OR Rename .env.example to .env and fill in the section that must be filled
- Run this command to start the server:
```
npm run start
```

## How to setup container in docker:
- Run this command to build images:
```
docker build --tag lpm-api:1.0 .
```
- Run this command to create container:
```
docker container create --name lpm-api -p 8000:8000 lpm-api:1.0
```
- Run this command to start the container:
```
docker container start lpm-api
```

## How to Contribute
- Create a new branch with the following naming convention: `<your-name>/<task>`
- Make your changes
- Push your changes to the branch you created
- Merge your branch into main

## API Documentation
### Version 1
- Base URL: `https://lpm-api.glitch.me/api`
- Documentation: `https://github.com/CPI-FS-SDG-11-D/LPM-api/tree/e49c6c5b343aa2949a6f96c532286da5ddb0ec0f`
  
### Version 2
- Base URL: `https://lpm-api-v2.glitch.me/api-v2`

### 1. Register User
- Method: `POST`
- URL Patterns: `{{base_url}}/register`
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
  -d '{
    "username": "username",
    "email": "email", 
    "password": "password"
  }' \
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
- URL Patterns: `{{base_url}}/login`
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
  -d '{
    "email": "email",
    "password": "password"
  }' \
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
- URL Patterns: `{{base_url}}/update-password`
- Authetication: `true`
- Body:
  ```json
  {
    "oldPassword": String,
    "newPassword": String,
    "confirmPassword": String
  }
  ```
- Usage:
  ```
  curl -X POST \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
  -d '{
    "oldPassword": "oldPassword",
    "newPassword": "newPassword",
    "confirmPassword": "confirmPassword"
  }' \
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
- URL Patterns: `{{base_url}}/profile`
- Authetication: `true`
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
- URL Patterns: `{{base_url}}/upload-user`
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
  -d '{ "image": "image" }' \
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
- URL Patterns: `{{base_url}}/history`
- Authetication: `true`
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
            //More Complaint...
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
- Method: `GET`
- URL Patterns: `{{base_url}}/complaints?page={page}&limit={limit}&title={title}`
- Authentication: `true OR false`
- Params: `page`, `limit`, `title`, default value are `page=1`, `limit=10` 
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

### 8. Detail Complaint
- Method: `GET`
- URL Patterns: `{{base_url}}/complaints/{id}`
- Authetication: `true OR false`
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
      "isComplaintOwner": Boolean,
    }
    ```
  - Errors: (404)
    ```json
    {
      "message": "Complaints NOT Found."
    }
    ```

### 9. Get Viral Complaints
- Method: `GET`
- URL Patterns: `{{base_url}}/complaints/viral`
- Authentication: `false`
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
        "virals": [
            {
                "_id": ObjectId,
                "title": String,
                "totalUpvotes": Number,
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
    
### 10. Add Complaint
- Method: `POST`
- URL Patterns: `{{base_url}}/complaints`
- Authetication: `true`
- Body: 
  ```json
  {
    "title": String,
    "description": String,
    "urlComplaint": String
  }
  ```
- Usage:
  ```
  curl -X POST \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{
    "title": "title",
    "description": "description",
    "urlComplaint": "urlComplaint"
  }' \
  URL_Patterns
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

### 11. Upload Image Complaint
- Method: `POST`
- URL Patterns: `{{base_url}}/upload-complaint`
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
  -d '{ "image": "image" }' \
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

### 12. Update Complaint Status
- Method: `PUT`
- URL Patterns: `{{base_url}}/complaints/update-status/{id}`
- Authetication: `true`
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
  -d '{ "status": "status" }' \
  URL_Patterns
  ```
- Response:
  - Success: (200)
    ```json
    {
      "message": "Complaint updated successfully"
    }
    ```
  - Errors: (500)
    ```json
    {
      "message": "Internal Server Error"
    }
    ```

### 13. Delete Complaint
- Method: `DELETE`
- URL Patterns: `{{base_url}}/complaints/{id}`
- Authetication: `true`
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
      "message": "Complaint deleted successfully"
    }
    ```
  - Errors: (500)
    ```json
    {
      "message": "Internal Server Error"
    }
    ```

### 14. Upvote Complaint
- Method: `PUT`
- URL Patterns: `{{base_url}}/upvote/{id}`
- Authetication: `true`
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
      "feedback": {
        "is_upvote": Boolean,
        "is_downvote": Boolean
      },
      "totalUpvotes": Number
    }
    ```
  - Errors: (500)
    ```json
    {
      "message": "User already voted"
    }
    ```

### 15. Downvote Complaint
- Method: `PUT`
- URL Patterns: `{{base_url}}/downvote/{id}`
- Authetication: `true`
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
      "feedback": {
        "is_upvote": Boolean,
        "is_downvote": Boolean
      },
      "totalDownvotes": Number
    }
    ```
  - Errors: (409)
    ```json
    {
      "message": "User already voted"
    }
    ```
