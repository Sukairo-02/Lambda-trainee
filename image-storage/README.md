# Endpoints

-   `POST` - https://brdk6scx50.execute-api.eu-north-1.amazonaws.com/dev/user/register  
    Body:
    ```json
    { "email": "mail@example.dom", "password": "min6SymbString" }
    ```
-   `POST` - https://brdk6scx50.execute-api.eu-north-1.amazonaws.com/dev/user  
    Body:
    ```json
    { "email": "mail@example.dom", "password": "min6SymbString" }
    ```
-   :lock: `PATCH` - https://brdk6scx50.execute-api.eu-north-1.amazonaws.com/dev/user  
    Headers:
    ```json
    { "Refresh": "refreshToken" }
    ```
-   :lock: `GET` - https://brdk6scx50.execute-api.eu-north-1.amazonaws.com/dev/images
-   :lock: `POST` - https://brdk6scx50.execute-api.eu-north-1.amazonaws.com/dev/images
-   :lock: `DELETE` - https://brdk6scx50.execute-api.eu-north-1.amazonaws.com/dev/images  
    Upload image by using returned data in following way:
    1. Copy and paste `...postData.fields` to `form-data`
    2. Add `Content-Type` field to `form-data`
    3. Add file to `file` field of `form-data`
    4. File must me of `image/*` mimetype and not exceed `10 MiB` size
    5. `POST` it to `postData.url`
-   :lock: `POST` - https://brdk6scx50.execute-api.eu-north-1.amazonaws.com/dev/images/read  
    Body (optional):
    ```json
    { "files": ["filename.img"] }
    ```
