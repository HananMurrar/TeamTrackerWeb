const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..')));

// connect to mongoDB
mongoose.connect('mongodb://127.0.0.1:27017/teamtrackerDB')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// project schema
const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    due: { type: String, default: "N/A" },
    status: { type: String, default: "In Progress" }
});

const Project = mongoose.model('Project', projectSchema);

// task schema
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    due: { type: String, default: "N/A" },
    status: { type: String, default: "In Progress" }
});

const Task = mongoose.model('Task', taskSchema);

// auth middle ware
function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ msg: 'No token, authorization denied' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Token missing' });

    try {
        const decoded = jwt.verify(token, 'secretkey');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

// register
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ msg: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });

        await user.save();
        res.status(201).json({ msg: 'Registered successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, 'secretkey', { expiresIn: '1h' });
        res.status(200).json({ msg: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// profile
app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

app.put('/api/profile', authMiddleware, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();
        res.json({ msg: 'Successfully updated'});
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// dashboard data - team members
app.get('/api/team', authMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('name email -_id');
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// dashboard data - projects
app.get('/api/projects', authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
    const { name, due } = req.body;

    try {
        const project = new Project({ name, due, status: "In Progress" });
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    try {
        const project = await Project.findByIdAndUpdate(id, { status }, { new: true });
        res.json(project);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// dashboard data - tasks
app.get('/api/tasks', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

app.post('/api/tasks', authMiddleware, async (req, res) => {
    const { title, projectId, due } = req.body;

    try {
        const task = new Task({ title, projectId, due, status: "In Progress" });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

app.put('/api/tasks/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
        res.json(task);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


