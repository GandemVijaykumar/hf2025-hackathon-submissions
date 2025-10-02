const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.linkedIn = req.body.linkedIn || user.linkedIn;
        user.skills = req.body.skills || user.skills;
        user.walletAddress = req.body.walletAddress || user.walletAddress;

        const updatedUser = await user.save();
        res.json(await User.findById(updatedUser._id).select('-password'));

    } else {
        res.status(404).json({ message: 'User not found' });
    }
};