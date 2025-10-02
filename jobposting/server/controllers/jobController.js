const Job = require('../models/Job');
const User = require('../models/User');

exports.createJob = async (req, res) => {
    const { title, description, skills, budget, paymentTxHash } = req.body;
    
    if (!paymentTxHash) {
         return res.status(400).json({ message: "Payment is required before posting a job."});
    }

    const job = new Job({
        title,
        description,
        skills,
        budget,
        paymentTxHash,
        author: req.user._id,
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
};

exports.getJobs = async (req, res) => {
    const jobs = await Job.find({}).populate('author', 'name');
    
    // AI Feature: Simple Job Matching
    if (req.user) {
       const user = await User.findById(req.user._id).select('skills');
       const userSkills = new Set(user.skills.map(s => s.toLowerCase()));

       const jobsWithMatchScore = jobs.map(job => {
           const jobSkills = new Set(job.skills.map(s => s.toLowerCase()));
           const commonSkills = [...userSkills].filter(skill => jobSkills.has(skill));
           const matchScore = (commonSkills.length / jobSkills.size) * 100;
           return { ...job.toObject(), matchScore: isNaN(matchScore) ? 0 : Math.round(matchScore) };
       });
       
       // Sort by match score
       jobsWithMatchScore.sort((a, b) => b.matchScore - a.matchScore);
       
       return res.json(jobsWithMatchScore);
    }
    
    res.json(jobs);
};

exports.getJobById = async (req, res) => {
    const job = await Job.findById(req.params.id).populate('author', 'name email');
    if (job) {
        res.json(job);
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};