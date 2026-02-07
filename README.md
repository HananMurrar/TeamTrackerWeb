### Team tracker web
- 🏢 Team tracker is website built for companies to manage projects, tasks, and team members efficiently, it helps teams track work and monitor the progress of projects and tasks
- 📶 The dashboard includes AI-style insights that analyze project and task data to suggest improvements and highlight risks

#### Features
- 🔗 Authentication:
  - User registration and login
  - JWT-based authentication for secure access
  - Passwords are hashed with bcrypt
  - Client-side check `auth.js` redirects unauthorized users to login
  - Routes requiring authentication use JWT middleware to ensure only logged in users can access data
  - When a user registers or login, the server verifies them and sends a JWT token saved in `local storage`; protected routes use this token, and if its missing, `auth.js` redirects the user to login

- 🔗 Dashboard – dynamic display:
  - Shows projects, tasks, and team members
  - Project management: create projects with a name and due date
  - Task management: create tasks with a name, assign to projects, and set due dates
  - Team management: display all registered team members
  - Profile management: users can update name, email, and password

- 🔗 Dashboard – real time statistics:
  - Displays total projects, active tasks, completed tasks, and delayed tasks
  - Updates automatically when task or project status changes
 
- 🔗 Dashboard – AI insights:
  - Generates real-time, dynamic AI-style insights based on the current state of projects and tasks
  - AI is a knowledge-based, analytical AI, using heuristic reasoning to detect patterns, infer risk, and provide actionable suggestions

#### Team tracker structure folder
```
📁 TeamTracker/
├─ js/
│   ├── regestration.js
│   ├── login.js
│   ├── profile.js
│   ├── dashboard.js     # Functions related to dashboard features
│   ├── server.js
│   └── auth.js          # Handles user authentication for protected page
├── index.html
├── regestration.html
├── login.html
├── profile.html
├── dashboard.html
├── mongosh.exe          # MongoDB shel
```
#### How to run
1. Install dependencies:
    ```
    npm init -y
    npm install express mongoose bcryptjs body-parser cors
    ```

2. Start mongoDB:
    ```
    .\mongosh 
    exit
    ```

3. Start the backend server:
    ```
    node js/server.js
    ```

4. Open your browser and go to:
    ```
    http://localhost:3000
    ```

#### Demo
