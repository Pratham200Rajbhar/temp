const express = require('express');
const port = 3001;
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connectionString = 'mongodb+srv://PrathamRajbhar:PrathamRajbhar@cluster0.5c9zh.mongodb.net/test';

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

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

        res.redirect('/success');
    } catch (error) {
        console.error('Error saving project:', error);
        res.status(500).send('Server error');
    }
});

app.get('/success', (req, res) => {
    res.send('Project successfully added to the database!');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/contact', (req, res) => {
    res.sendFile(__dirname + '/contact.html');
})

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
