# Location Logging API - Postman Collection

In this folder, you will find a Postman collection to easily test your API.

## Usage

1. **Open Postman.**
2. Import `LocationLoggingAPI.postman_collection.json` file.

3. Test your API using sample requests in the collection.

## Endpoints

- **GET /areas**: Lists all defined areas.
- **POST /areas**: Adds a new polygon.
- **GET /logs**: Lists logged area entries.
- **POST /locations**: User sends location, logs if inside an area.

## Sample Test Flow

1. Display existing areas with `GET /areas`.

2. Add a new area with `POST /areas` (sample body is ready in the collection).
3. Send a user's location with `POST /locations` (example body is ready in the collection). If the coordinates are in a field, a log is created.

4. View the logs with `GET /logs`.

## Notes
- Server: `http://localhost:3000`