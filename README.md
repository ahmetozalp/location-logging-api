# Location Logging API

This project is a high-performance, scalable NestJS API for logging user locations and checking if they enter predefined geographic areas (polygons). It is designed to handle heavy load and concurrent requests efficiently.

## Features
- **Log user locations** and check if they enter any predefined area (polygon)
- **List and create areas** (GeoJSON polygons)
- **List logs** of area entries (with user, area, and timestamp)
- **Highly concurrent**: optimized for high-load scenarios
- **Pagination** for large datasets
- **Postman collection** included for easy testing

## How to Run

1. **Install dependencies:**
   ```bash
   pnpm install
   ```
2. **Configure your PostgreSQL connection** in `.env` (see `prisma/schema.prisma` for details)
3. **Run database migrations:**
   ```bash
   pnpm exec prisma migrate dev --name init
   pnpm exec prisma generate
   ```
4. **(Optional) Seed test data:**
   ```bash
   pnpm exec ts-node scripts/seed.ts
   # or for bulk area insert:
   pnpm exec ts-node scripts/bulk-seed.ts
   ```
5. **Start the server:**
   ```bash
   pnpm run start:dev
   ```

## How to Run Tests

> **Note:** The server must be running at `http://localhost:3000` for e2e tests to work.

- **Run all tests:**
  ```bash
  pnpm run test
  ```
- **Run only e2e tests:**
  ```bash
  pnpm run test:e2e
  ```
- **What is tested?**
  - API endpoints (including `/locations` under load)
  - Example: `test/locations.e2e-spec.ts` sends 100 concurrent POST requests to `/locations` and checks the results.

## API Endpoints

### 1. Create Area
- **POST /areas**
- **Body:**
  ```json
  {
    "name": "Test Area",
    "polygon": {
      "type": "Polygon",
      "coordinates": [
        [
          [29.9, 40.4], [29.9, 40.6], [30.1, 40.6], [30.1, 40.4], [29.9, 40.4]
        ]
      ]
    }
  }
  ```

### 2. List Areas (Paginated)
- **GET /areas?page=1&limit=100**
- **Query Params:**
  - `page` (default: 1)
  - `limit` (default: 100)
- **Response:**
  ```json
  {
    "items": [ ... ],
    "total": 1000000,
    "page": 1,
    "limit": 100,
    "pageCount": 10000
  }
  ```

### 3. Log User Location
- **POST /locations**
- **Body:**
  ```json
  {
    "userId": "test-user-1",
    "latitude": 40.000,
    "longitude": 30.000
  }
  ```
- **Response:**
  ```json
  {
    "enteredAreas": ["area-id-1", ...],
    "logs": [ { "userId": "...", "areaId": "...", "timestamp": "..." }, ... ]
  }
  ```

### 4. List Logs (Paginated)
- **GET /logs?page=1&limit=100**
- **Query Params:**
  - `page` (default: 1)
  - `limit` (default: 100)
- **Response:**
  ```json
  {
    "items": [ { "userId": "...", "areaId": "...", "timestamp": "...", ... }, ... ],
    "total": 12345,
    "page": 1,
    "limit": 100,
    "pageCount": 124
  }
  ```

## Load Testing
- The project includes a Jest test (`test/locations.e2e-spec.ts`) that sends 100 concurrent POST requests to `/locations` to verify high-load performance.

## Postman Collection
- A ready-to-use Postman collection is available in the `postman/` folder.
- Import `postman/LocationLoggingAPI.postman_collection.json` into Postman to test all endpoints easily, including paginated requests.

## Notes
- All polygons use GeoJSON format: coordinates are `[longitude, latitude]`.
- The system is optimized for large datasets (millions of areas/logs) and concurrent requests.
- For best performance, use pagination on all list endpoints.

---

**Developed by Ahmet ÖZALP**

Feel free to reach out for questions, improvements, or contributions!
