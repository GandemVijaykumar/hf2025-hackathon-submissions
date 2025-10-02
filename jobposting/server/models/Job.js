const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: [{ type: String, required: true }],
    budget: { type: Number, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paymentTxHash: { type: String, required: true }, // To verify payment
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);