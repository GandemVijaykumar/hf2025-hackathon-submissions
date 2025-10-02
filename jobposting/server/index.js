const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);

// Simple AI endpoint for skill extraction (demonstration)
app.post('/api/ai/extract-skills', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ message: 'No text provided' });
    }
    // Simple NLP: match keywords from a predefined list
    const SKILL_KEYWORDS = ['JavaScript', 'React', 'Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'HTML', 'CSS', 'Tailwind', 'Solidity', 'Rust', 'Ethers.js', 'Web3.js', 'AI', 'Machine Learning'];
    const foundSkills = new Set();
    const words = text.replace(/,/g, ' ').split(/\s+/);

    words.forEach(word => {
        SKILL_KEYWORDS.forEach(skill => {
            if (word.toLowerCase() === skill.toLowerCase()) {
                foundSkills.add(skill);
            }
        });
    });

    res.json({ skills: Array.from(foundSkills) });
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));