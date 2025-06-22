# Podbay Clone Backend (خليج البودكاست )

This is the backend service for Podbay clone, a podcast search application. It is built with NestJS and designed to be scalable and support multiple podcast vendors.

## 🎯 Overview

This backend service powers the Podbay clone podcast search application, providing a comprehensive REST API for podcast and episode discovery. Built with enterprise-grade architecture patterns, it offers multi-vendor integration capabilities, intelligent data caching, and robust error handling.

## Features

- **Podcast Search:** Provides a REST API endpoint to search for podcasts using a given term.
- **Multi-Vendor Support:** Designed to integrate with various podcast vendors (currently supports iTunes Search API) for easy scalability.
- **Data Persistence:** Stores search results (podcasts and episodes) in a PostgreSQL database to reduce redundant API calls and provide a local data source.
- **Robust API:** Built with NestJS, offering a modular, testable, and maintainable architecture.
- **Automated Testing:** Covered by unit and end-to-end tests to ensure reliability and correctness.

## Technologies Used

- **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Validation:** `class-validator` and `class-transformer`
- **HTTP Client:** `axios`
- **Testing:** Jest, Supertest

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn
- PostgreSQL database

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-repo/podbay.git
    cd podbay/backend
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or yarn install
    ```

3.  Create a `.env` file in the `backend/` directory based on `.env.example` and configure your database connection and other environment variables:

    ```
    PORT=3000
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=postgres
    DB_DATABASE=podbay
    NODE_ENV=dev
    ```

4.  Run database migrations: (Optional on dev as typeorm automatically syncs the database)
    ```bash
    npm run migration:run
    ```

### Running the Application

- **Development Mode (with watch):**

  ```bash
  npm run start:dev
  ```

- **Production Mode:**

  ```bash
  npm run build
  ```

  ```bash
  npm run start:prod
  ```

The application will typically run on `http://localhost:3001` (or the `PORT` specified in your `.env` file).

## API Endpoints

### Search Podcasts and Episodes

`GET /search`

Searches for podcasts and episodes based on a given term from configured vendors (e.g., iTunes) and stores them in the database.

**Query Parameters:**

- `term` (string, required): The search term (e.g., "فنجان").

**Example Request:**

```plaintext
GET http://localhost:3001/search?term=فنجان
```

**Example Response:**

```json
{
  "podcasts": [
    // ... list of podcast objects ...
  ],
  "episodes": [
    // ... list of episode objects ...
  ]
}
```

## Testing

- Run all tests:

```bash
npm test
```

## Project Structure

```plaintext
backend/
├── src/
│   ├── app.module.ts         # Main application module
│   ├── main.ts               # Application entry point
│   ├── artist/               # Artist-related modules, services, entities
│   ├── episode/              # Episode-related modules, services, entities
│   ├── podcast/              # Podcast-related modules, services, entities
│   ├── search/               # Search functionality (controller, service, module)
│   ├── vendor/               # Vendor integration (e.g., iTunes API client)
│   └── migrations/           # TypeORM database migrations
├── test/                     # End-to-end tests
├── .env.example              # Example environment variables
├── package.json              # Project dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## License

This project is licensed under the MIT License.

---

Built with ❤️ and backpain.
