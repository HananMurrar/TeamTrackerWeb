const dynamicSection = document.getElementById("dynamic-section");
const aiContainer = document.querySelector(".space-y-4");

let projects = [];
let tasks = [];
let team = [];

// fetch data from server
const token = localStorage.getItem('token'); // get token from login

async function fetchTeam() {
    try {
        const res = await fetch('http://localhost:3000/api/team', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        team = await res.json();
    } catch (err) {
        console.error("Failed to fetch team:", err);
    }
}

async function fetchProjects() {
    try {
        const res = await fetch('http://localhost:3000/api/projects', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        projects = await res.json();
    } catch (err) {
        console.error("Failed to fetch projects:", err);
    }
}

async function fetchTasks() {
    try {
        const res = await fetch('http://localhost:3000/api/tasks', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        tasks = await res.json();
    } catch (err) {
        console.error("Failed to fetch tasks:", err);
    }
}

// render functions
function renderTeam() {
    removeExistingForms();

    let html = `<h2 class="text-2xl font-semibold mb-4 text-[#4651b1] flex justify-between items-center">
                    Team Members
                </h2><div class="space-y-3">`;

    team.forEach(member => {
        html += `<div class="flex justify-between items-center p-4 border rounded">
            <div>
                <p class="font-semibold">${member.name}</p>
                <p class="text-sm text-gray-500">🔗 ${member.email}</p>
            </div>
        </div>`;
    });

    html += `</div>`;
    dynamicSection.innerHTML = html;
}

function renderProjects() {
    const sortedProjects = projects.slice().sort((a, b) => {
        if (a.due === "N/A") return 1;
        if (b.due === "N/A") return -1;
        return new Date(a.due) - new Date(b.due);
    });

    let html = `<h2 class="text-2xl font-semibold mb-4 text-[#4651b1] flex justify-between items-center">
                    Projects
                    <button onclick="showAddProjectForm()" class="text-sm bg-[#4651b1] text-white px-3 py-1 rounded hover:bg-[#3b4599] w-36 text-center">+ Add Project</button>
                </h2><div class="space-y-3">`;

    sortedProjects.forEach((p, i) => {
        html += `<div class="flex justify-between items-center p-4 border rounded ${isOverdue(p.due) && p.status === "In Progress" ? "bg-red-50" : ""}">
            <div>
                <p class="font-semibold">${p.name}</p>
                <span class="text-sm text-gray-500">📅 ${p.due}</span>
            </div>

            <button class="project-status w-28 text-center text-sm font-medium px-3 py-1 rounded ${p.status === "In Progress" ? "bg-yellow-500" : p.status === "Done" ? "bg-green-500" : "bg-red-500"} text-white">
                ${p.status}
            </button>
        </div>`;
    });

    html += `</div>`;
    dynamicSection.innerHTML = html;

    addProjectStatusEvents();
    updateStats();
    generateAIInsights();
}

function renderTasks() {
    const sortedTasks = tasks.slice().sort((a, b) => {
        if (a.due === "N/A") return 1;
        if (b.due === "N/A") return -1;
        return new Date(a.due) - new Date(b.due);
    });

    let html = `<h2 class="text-2xl font-semibold mb-4 text-[#4651b1] flex justify-between items-center">
                    Tasks
                    <button onclick="showAddTaskForm()" class="text-sm bg-[#4651b1] text-white px-3 py-1 rounded hover:bg-[#3b4599] w-36 text-center">+ Add Task</button>
                </h2><div class="space-y-3">`;

    sortedTasks.forEach((t, i) => {
        const project = projects.find(p => p._id.toString() === t.projectId.toString());

        html += `<div class="flex justify-between items-center p-4 border rounded ${isOverdue(t.due) && t.status === "In Progress" ? "bg-red-50" : ""}">
            <div class="flex-1">
                <p class="font-semibold">${t.title}</p>

                <div class="flex gap-4 text-sm text-gray-500 mt-1">
                    <span>📁 ${project ? project.name : "N/A"}</span>
                    <span>📅 ${t.due}</span>
                </div>
            </div>
            
            <button class="task-status w-28 text-center text-sm font-medium px-3 py-1 rounded ${t.status === "In Progress" ? "bg-yellow-500" : t.status === "Done" ? "bg-green-500" : "bg-red-500"} text-white">
                ${t.status}
            </button>
        </div>`;
    });

    html += `</div>`;
    dynamicSection.innerHTML = html;

    addTaskStatusEvents();
    updateStats();
    generateAIInsights();
}

// stats
function updateStats() {
    const active = tasks.filter(t => t.status === "In Progress").length;
    const completed = tasks.filter(t => t.status === "Done").length;
    const delayed = tasks.filter(t => t.status === "Delayed").length;

    document.getElementById("total-projects").textContent = projects.length;
    document.getElementById("total-active").textContent = active;
    document.getElementById("total-completed").textContent = completed;
    document.getElementById("total-delayed").textContent = delayed;
}

function addProjectStatusEvents() {
    dynamicSection.querySelectorAll(".project-status").forEach((btn, i) => {
        btn.addEventListener("click", () => {
            const statuses = ["In Progress", "Done", "Delayed"];
            const colors = ["bg-yellow-500", "bg-green-500", "bg-red-500"];
            let current = statuses.indexOf(btn.textContent);
            let next = (current + 1) % statuses.length;

            btn.textContent = statuses[next];
            colors.forEach(c => btn.classList.remove(c));
            btn.classList.add(colors[next]);
            projects[i].status = statuses[next];

            updateStats();
            generateAIInsights();
            updateProjectStatus(projects[i]._id, statuses[next]);
        });
    });
}

function addTaskStatusEvents() {
    dynamicSection.querySelectorAll(".task-status").forEach((btn, i) => {
        btn.addEventListener("click", () => {
            const statuses = ["In Progress", "Done", "Delayed"];
            const colors = ["bg-yellow-500", "bg-green-500", "bg-red-500"];
            let current = statuses.indexOf(btn.textContent);
            let next = (current + 1) % statuses.length;

            btn.textContent = statuses[next];
            colors.forEach(c => btn.classList.remove(c));
            btn.classList.add(colors[next]);
            tasks[i].status = statuses[next];

            updateStats();
            generateAIInsights();
            updateTaskStatus(tasks[i]._id, statuses[next]);
        });
    });
}

// add form
function showAddProjectForm() {
    removeExistingForms();

    const formHtml = `<div class="p-4 border rounded bg-gray-50 mt-3 space-y-2">
        <input type="text" id="newProjectName" placeholder="Project Name" class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"/>
        <input type="date" id="newProjectDue" class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"/>
        <button onclick="addProject()" class="bg-[#4651b1] text-white px-3 py-1 rounded hover:bg-[#3b4599] w-32 text-center">Add Project</button>
        <p id="projectMessage" class="text-red-500 text-sm mt-1"></p>
      </div>`;

    dynamicSection.insertAdjacentHTML('beforeend', formHtml);
}

function showAddTaskForm() {
    removeExistingForms();

    let projectOptions = projects.map(p => `<option value="${p._id}">${p.name}</option>`).join("");
    const formHtml = `<div class="p-4 border rounded bg-gray-50 mt-3 space-y-2">
        <input type="text" id="newTaskTitle" placeholder="Task Name" class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"/>
        <select id="newTaskProject" class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400">
            ${projectOptions}
        </select>
        <input type="date" id="newTaskDue" class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"/>
        <button onclick="addTask()" class="bg-[#4651b1] text-white px-3 py-1 rounded hover:bg-[#3b4599] w-32 text-center">Add Task</button>
        <p id="taskMessage" class="text-red-500 text-sm mt-1"></p>
      </div>`;

    dynamicSection.insertAdjacentHTML('beforeend', formHtml);
}

function removeExistingForms() {
    dynamicSection.querySelectorAll("div.bg-gray-50").forEach(f => f.remove());
}

// add  functions with data validation
async function addProject() {
    const name = document.getElementById("newProjectName").value.trim();
    const dueRaw = document.getElementById("newProjectDue").value;
    const message = document.getElementById("projectMessage");
    message.textContent = "";

    if (!name) {
        message.textContent = "❌ Enter project name";
        return;
    }
    if (projects.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        message.textContent = "❌ Project name already exists";
        return;
    }
    if (dueRaw && new Date(dueRaw) < new Date().setHours(0, 0, 0, 0)) {
        message.textContent = "❌ Date cannot be in the past";
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`   // <-- ADD THIS
            },
            body: JSON.stringify({ name, due: dueRaw || "N/A" })
        });
        const project = await res.json();
        projects.push(project);
        renderProjects();
    } catch (err) {
        console.error(err);
        message.textContent = "❌ Failed to add project";
    }
}

async function addTask() {
    const title = document.getElementById("newTaskTitle").value.trim();
    const projectId = document.getElementById("newTaskProject").value;
    const dueRaw = document.getElementById("newTaskDue").value;
    const message = document.getElementById("taskMessage");
    message.textContent = "";

    if (!title) {
        message.textContent = "❌ Enter task name";
        return;
    }
    if (tasks.some(t => t.title.toLowerCase() === title.toLowerCase() && t.projectId === projectId)) {
        message.textContent = "❌ Task name already exists in this project";
        return;
    }
    if (dueRaw && new Date(dueRaw) < new Date().setHours(0, 0, 0, 0)) {
        message.textContent = "❌ Date cannot be in the past";
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`   // <-- ADD THIS
            },
            body: JSON.stringify({ title, projectId, due: dueRaw || "N/A" })
        });
        const task = await res.json();
        tasks.push(task);
        renderTasks();
    } catch (err) {
        console.error(err);
        message.textContent = "❌ Failed to add task";
    }
}

// update status
async function updateTaskStatus(id, status) {
    try {
        await fetch(`http://localhost:3000/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
    } catch (err) {
        console.error("Failed to update task status", err);
    }
}

async function updateProjectStatus(id, status) {
    try {
        await fetch(`http://localhost:3000/api/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
    } catch (err) {
        console.error("Failed to update project status", err);
    }
}

// navigation
document.querySelectorAll("aside nav a").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();

        const target = link.textContent.toLowerCase();
        if (target.includes("tasks")) renderTasks();
        else if (target.includes("projects")) renderProjects();
        else if (target.includes("team")) renderTeam();
        else if (target.includes("dashboard")) renderAddOptions();
    });
});

function renderAddOptions() {
    removeExistingForms();

    dynamicSection.innerHTML = `<div class="flex gap-4">
        <button onclick="showAddProjectForm()" class="bg-[#4651b1] text-white w-40 py-2 rounded hover:bg-[#3b4599] text-center">+ Add Project</button>
        <button onclick="showAddTaskForm()" class="bg-[#4651b1] text-white w-40 py-2 rounded hover:bg-[#3b4599] text-center">+ Add Task</button>
      </div>`;
    generateAIInsights();
}

// the AI insights
function generateAIInsights() {
    aiContainer.innerHTML = "";

    // basic counts part
    const totalProjects = projects.length;
    const totalTasks = tasks.length;

    const projectStats = {
        inProgress: projects.filter(p => p.status === "In Progress").length,
        done: projects.filter(p => p.status === "Done").length,
        delayed: projects.filter(p => p.status === "Delayed").length
    };

    const taskStats = {
        inProgress: tasks.filter(t => t.status === "In Progress").length,
        done: tasks.filter(t => t.status === "Done").length,
        delayed: tasks.filter(t => t.status === "Delayed").length
    };

    if (projectStats.inProgress > 0)
        aiContainer.appendChild(createInsight(`⏳ ${projectStats.inProgress} project(s) in progress`, "suggestion"));

    if (projectStats.done > 0)
        aiContainer.appendChild(createInsight(`✅ ${projectStats.done} project(s) completed`, "success"));

    if (projectStats.delayed > 0)
        aiContainer.appendChild(createInsight(`⛔ ${projectStats.delayed} project(s) delayed`, "warning"));

    if (taskStats.inProgress > 0)
        aiContainer.appendChild(createInsight(`⏳ ${taskStats.inProgress} task(s) in progress`, "suggestion"));

    if (taskStats.done > 0)
        aiContainer.appendChild(createInsight(`✅ ${taskStats.done} task(s) completed`, "success"));

    if (taskStats.delayed > 0)
        aiContainer.appendChild(createInsight(`⛔ ${taskStats.delayed} task(s) delayed`, "warning"));

    // real analysis part
    if (totalTasks > 0) {
        const delayedRatio = taskStats.delayed / totalTasks;
        const progressRatio = taskStats.inProgress / totalTasks;
        const completionRatio = taskStats.done / totalTasks;

        // risk inference
        if (delayedRatio >= 0.4) {
            aiContainer.appendChild(
                createInsight("⚠️ High delay pattern detected, current workflow may be inefficient", "warning")
            );
        }

        // productivity inference
        if (completionRatio >= 0.6) {
            aiContainer.appendChild(
                createInsight("🚀 Strong productivity trend detected, task completion rate is high", "success")
            );
        }

        // pressure inference
        if (progressRatio >= 0.6 && taskStats.delayed === 0) {
            aiContainer.appendChild(
                createInsight("🔗 Many tasks are active but none delayed, system is under pressure but stable", "suggestion")
            );
        }
    }

    // project health analysis
    if (totalProjects > 0) {
        const delayedProjectsRatio = projectStats.delayed / totalProjects;

        if (delayedProjectsRatio >= 0.3) {
            aiContainer.appendChild(
                createInsight("📁 Project(s) show delay signals, resource allocation may need review", "warning")
            );
        }
    }
}

// helper functions
function isOverdue(due) {
    if (due === "N/A") return false;

    return new Date(due).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
}

function createInsight(text, type) {
    const div = document.createElement("div");

    const colors = {
        warning: "bg-red-50 border-red-500",
        success: "bg-green-50 border-green-500",
        suggestion: "bg-yellow-50 border-yellow-500"
    };

    div.className = `p-3 rounded border-l-4 ${colors[type]}`;
    div.innerText = text;

    return div;
}

// for show first name for current user
function getUserFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
}

const user = getUserFromToken();
if (user && user.name) {
    const firstName = user.name.split(" ")[0];
    document.getElementById("welcome-user").textContent = `Welcome, ${firstName}`;
}

// for the logout link
const logoutBtn = document.getElementById('logout-link');

if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token'); // remove token
        window.location.href = 'index.html';
    });
}

// initialize
(async function initDashboard() {
    await fetchTeam();
    await fetchProjects();
    await fetchTasks();
    renderAddOptions();
})();
