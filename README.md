# User Authentication Backend

This repository contains the backend implementation for user authentication with a database. The application is built using Node.js and Express, with Sequelize as the ORM for database interactions.

## Features

- User Registration
- User Login
- JWT (JSON Web Token) based Authentication
- Google OAuth2.0 Authentication
- Session Management
- Password Hashing with bcrypt
- CORS Support

## Prerequisites

Before running the application, make sure you have the following installed:
- Node.js
- npm or yarn
- MySQL database

## Installation

1. Clone this repository to your local machine.
2. Open the terminal in the repository directory.
3. Install the packages:

```bash
npm install
```

4. Create `.env` file in the root folder and copy paste the content of `.env.sample`, and add necessary credentials.
5. To start project run

```bash
npm run dev
```

6. Before commit run

```bash
# To beautify the code formatting
npm run lint
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.


