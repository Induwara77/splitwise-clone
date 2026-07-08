# Splitwise Clone

A full-stack expense splitting app built with React, Node.js, Express, and MongoDB.

## Live Demo

Frontend: https://splitwise-clone-livid.vercel.app
Backend: https://splitwise-clone-production-b7e6.up.railway.app

## Features

- User registration and login with JWT authentication
- Add expenses with description and amount
- Expenses automatically split among all registered users
- Real-time balance calculation showing who owes who
- Delete expenses
- Secure password hashing with bcrypt

## Tech Stack

Frontend: React, Vite, Tailwind CSS, Axios, React Router
Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

## How to test with multiple users

Since each browser shares the same localStorage, use different browsers to simulate different users.

For example:
- Chrome — login as User 1
- Firefox — login as User 2
- Edge — login as User 3

Each user can add expenses and the balance section updates automatically for all users.

## Known Limitations

- All registered users are in one shared group. A future version would add group creation and invite system.
- One browser can only be logged into one account at a time due to localStorage token storage.
