# VG-LOG

This web application is designed to help gamers manage their game backlogs, reduce decision paralysis, and provide personalised game recommendations. The app uses collaborative filtering and content-based filtering models to suggest games for users to complete from their backlog and recommend new games to add to their collection.

## Features

- **Backlog Management**: Track your game backlog and update game statuses, as well as add goals and notes.
- **Collaborative Filtering**: Get game recommendations based on the preferences of similar users.
- **Content-Based Filtering**: Receive new game recommendations tailored to your existing game preferences.
- **User-Friendly Interface**: Easily manage your backlog and explore game recommendations through an intuitive UI.

## Website

For convenience, the app can also be accessed with a web browser using the following link:

https://vg-log.onrender.com

Note that due to limitations of the free hosting service used, it may take some time to load the site.

## Using the Website

You can use the following login details to use the site:

Username: test
Password: test

## Installation (Local)

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/download/)

### Running Locally

1. Build the Frontend:
    ```
    cd frontend/
    npm run build
    ```

2. Build the Backend:
    ```
    cd ..
    cd backend/
    npm run build
    ```

3. Run the Backend:
    ```
    npm run start
    ```

4. Access via URL: http://localhost:5000