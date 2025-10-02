import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Notification from '../components/Notification';

function ProfilePage() {
    const { userInfo, updateUser } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', bio: '', linkedIn: '', skills: '', walletAddress: '' });
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        // ... (this useEffect to fetch profile is unchanged)
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/users/profile');
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    bio: data.bio || '',
                    linkedIn: data.linkedIn || '',
                    skills: data.skills?.join(', ') || '',
                    walletAddress: data.walletAddress || ''
                });
            } catch (error) { console.error("Failed to fetch profile", error); }
        };
        if (userInfo) { fetchProfile(); }
    }, [userInfo]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
    };
    
    // ==========================================================
    // NEW FUNCTION TO HANDLE AI SKILL EXTRACTION
    // ==========================================================
    const handleAIExtract = async () => {
        if (!formData.bio) {
            showNotification("Please write something in your bio first.", "error");
            return;
        }
        try {
            // Call the AI endpoint on the backend
            const { data } = await api.post('/ai/extract-skills', { text: formData.bio });
            
            // Update the form state with the extracted skills
            setFormData(prev => ({ ...prev, skills: data.skills.join(', ') }));
            
            showNotification("Skills extracted from bio!", "success");
        } catch (error) {
            showNotification("Could not extract skills.", "error");
        }
    }
    // ==========================================================
    // END OF NEW FUNCTION
    // ==========================================================

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
            const { data } = await api.put('/users/profile', { ...formData, skills: skillsArray });
            updateUser(data); // Update global state
            showNotification("Profile updated successfully!", "success");
        } catch (error) {
            showNotification("Failed to update profile.", "error");
        }
    };
    
    return (
        <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
            <Notification message={notification.message} type={notification.type} onClear={() => setNotification({ message: '', type: '' })} />
            <h2 className="text-2xl font-bold mb-6 text-cyan-400">My Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                 {/* ... (other form fields are unchanged) ... */}
                 <div>
                    <label className="block text-gray-300">Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-700 text-white rounded-md p-2" />
                </div>
                <div>
                    <label className="block text-gray-300">Email</label>
                    <input type="email" name="email" value={formData.email} disabled className="w-full bg-gray-900 text-gray-400 rounded-md p-2" />
                </div>
                 <div>
                    <label className="block text-gray-300">Bio</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className="w-full bg-gray-700 text-white rounded-md p-2" placeholder="Describe your experience here..."></textarea>
                </div>

                {/* ========================================================== */}
                {/* UPDATED SKILLS INPUT FIELD */}
                {/* ========================================================== */}
                <div className="relative">
                    <label htmlFor="skills" className="block text-gray-300 mb-1">Skills (comma-separated)</label>
                    <input type="text" id="skills" name="skills" value={formData.skills} onChange={handleChange} className="w-full bg-gray-700 text-white rounded-md p-2 pr-24"/>
                    {/* The new AI Extract button */}
                    <button type="button" onClick={handleAIExtract} className="absolute right-2 top-8 text-xs bg-cyan-600 hover:bg-cyan-700 px-2 py-1 rounded-md transition-colors">
                        ✨ AI Extract
                    </button>
                </div>
                {/* ========================================================== */}
                {/* END OF UPDATED FIELD */}
                {/* ========================================================== */}
                
                <div>
                    <label className="block text-gray-300">LinkedIn Profile</label>
                    <input type="text" name="linkedIn" value={formData.linkedIn} onChange={handleChange} className="w-full bg-gray-700 text-white rounded-md p-2" />
                </div>
                <div>
                    <label className="block text-gray-300">Wallet Address for Payments</label>
                    <input type="text" name="walletAddress" value={formData.walletAddress} onChange={handleChange} className="w-full bg-gray-700 text-white rounded-md p-2" />
                </div>

                <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg">Update Profile</button>
            </form>
        </div>
    );
}

export default ProfilePage;