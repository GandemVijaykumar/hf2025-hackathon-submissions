const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createJob).get(protect, getJobs); // `protect` on getJobs to enable matching
router.route('/:id').get(protect, getJobById);

module.exports = router;