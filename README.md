# Video Game Backlog Management Web App

This web application is designed to help gamers manage their game backlogs, reduce decision paralysis, and provide personalized game recommendations. The app uses collaborative filtering and content-based filtering models to suggest games for users to complete from their backlog and recommend new games to add to their collection.

## Features

- **Backlog Management**: Track your game backlog and update game statuses, as well as add goals and notes.
- **Collaborative Filtering**: Get game recommendations based on the preferences of similar users.
- **Content-Based Filtering**: Receive new game recommendations tailored to your existing game preferences.
- **User-Friendly Interface**: Easily manage your backlog and explore game recommendations through an intuitive UI.

## Installation

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/)

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