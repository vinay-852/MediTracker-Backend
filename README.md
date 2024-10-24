# MediTracker BackEnd

This is a Node.js project that uses Express.js to create a RESTful API. The project includes user and schedule management functionalities.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/vinay-852/MediTracker-Backend.git
    ```
2. Navigate to the project directory:
    ```sh
    cd MediTracker-Backend
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
4. Create a `.env` file in the root directory and add your environment variables:
    ```env
    PORT=8080
    MONGO_URI=<your-mongodb-uri>
    ```

## Usage

1. Start the server:
    ```sh
    npm start
    ```
2. The server will be running on `http://localhost:8080`.

## API Endpoints

### User Routes

- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get a user by ID
- `PUT /api/users/:id` - Update a user by ID
- `DELETE /api/users/:id` - Delete a user by ID

### Schedule Routes

- `GET /api/schedules` - Get all schedules
- `POST /api/schedules` - Create a new schedule
- `GET /api/schedules/:id` - Get a schedule by ID
- `PUT /api/schedules/:id` - Update a schedule by ID
- `DELETE /api/schedules/:id` - Delete a schedule by ID

## Contributing

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature-branch
    ```
3. Make your changes and commit them:
    ```sh
    git commit -m 'Add some feature'
    ```
4. Push to the branch:
    ```sh
    git push origin feature-branch
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License.
