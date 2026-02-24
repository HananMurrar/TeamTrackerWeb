### Team tracker web
Team tracker is website built for companies to manage projects, tasks, and team members efficiently, it helps teams track work and monitor the progress of projects and tasks

The dashboard includes AI-style insights that analyze project and task data to suggest improvements and highlight risks

#### Features:
##### Authentication:
- User registration and login: users can create an account and log in to access the system
- Secure passwords: passwords are never stored as plain text, they are hashed using bcrypt, which scrambles them so even if someone gets the database, they can’t read the passwords
- JWT based authentication: after logging in, the server creates a JWT (JSON web token), the token proves the user is authenticated, it contains basic user info (like ID and email) and is signed so it cannot be altered
- Client side protection: the `auth.js` checks if the user has a valid token in `localStorage`, if the token is missing, the user is automatically redirected to the login page, this prevents unauthorized users from opening protected pages directly
- Protected routes: the `server.js` uses JWT middleware to protect certain routes, when a request is made, the middleware checks the token in the request headers, only users with a valid token can access the data, if the token is invalid or missing, the server denies access with an error

##### Dashboard – dynamic display:
- Shows projects, tasks, and team members
- Project management: create projects with a name and due date
- Task management: create tasks with a name, assign to projects, and set due dates
- Team management: display all registered team members
- Profile management: users can update name, email, and password
- Data validation: project and task names cannot be empty, project names must be unique, task names must be unique within the same project, due dates cannot be in the past

##### Dashboard – real time statistics:
- Displays total projects, active tasks, completed tasks, and delayed tasks
- Updates automatically when task or project status changes
 
##### Dashboard – AI insights:
- AI is knowledge-based, analytical AI using heuristic reasoning
- Real-time-dynamic insights: the dashboard continuously analyzes projects and tasks and generates insights as data changes
- Analytical reasoning: detects patterns and trends in your workflow using knowledge-based logic
- Risk detection: identifies potential problems such as delays, bottlenecks, or workflow inefficiencies and highlights areas that need attention
- Actionable suggestions: provides practical recommendations based on analysis to improve productivity and management

#### Team tracker structure folder:
```
📁 TeamTracker/
├─ js/
│  ├── regestration.js
│  ├── login.js
│  ├── profile.js
│  ├── dashboard.js     # Functions related to dashboard features
│  ├── server.js
│  └── auth.js          # Handles user authentication for protected page
├── index.html
├── regestration.html
├── login.html
├── profile.html
├── dashboard.html
├── mongosh.exe         # MongoDB shel
```

#### How to run:
##### 1. Install dependencies:
    npm init -y
    npm install express mongoose bcryptjs body-parser cors

##### 2. Start mongoDB:
    .\mongosh 
    exit

##### 3. Start the backend server:
    node js/server.js

##### 4. Open your browser and go to:
    http://localhost:3000

#### Demo:
- [Watch the demo video (download)](https://github.com/HananMurrar/TeamTrackerWeb/raw/main/TeamTracker/Demo.mp4)
