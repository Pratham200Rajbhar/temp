const express = require('express');
const port = 3001;
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Replace this with your MongoDB connection string
const connectionString = 'mongodb+srv://PrathamRajbhar:PrathamRajbhar@cluster0.5c9zh.mongodb.net/test';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('Database connection error:', err));

// Project Schema and Model
const projectSchema = new mongoose.Schema({
    thumbnail: String,
    title: String,
    description: String,
    github: String,
    demo: String,
    isBlog: Boolean,
}, { collection: 'projectslist' });

const Project = mongoose.model('Project', projectSchema);

app.post('/getData', async (req, res) => {
    try {
        const { thumbnail, title, description, github, demo, isBlog } = req.body;

        const newProject = new Project({
            thumbnail,
            title,
            description,
            github,
            demo,
            isBlog: isBlog === 'true',
        });

        await newProject.save();
        res.status(201).send('Project successfully added to the database!');
    } catch (error) {
        console.error('Error saving project:', error);
        res.status(500).send('Server error');
    }
});

// Contact Schema and Model
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
}, { collection: 'contact' });

const Contact = mongoose.model('Contact', contactSchema);

// POST route to save contact form data
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const newContact = new Contact({
            name,
            email,
            message,
        });

        await newContact.save();
        res.status(201).send("Message sent successfully!");
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send('Server error');
    }
});

app.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find({});
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
