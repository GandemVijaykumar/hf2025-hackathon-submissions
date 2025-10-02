import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PostJobForm from '../components/PostJobForm';
import JobItem from '../components/JobItem';
import Notification from '../components/Notification';

function HomePage() {
const { userInfo } = useAuth();
const [jobs, setJobs] = useState([]);
const [notification, setNotification] = useState({ message: '', type: '' });

      
const fetchJobs = async () => {
    try {
        const { data } = await api.get('/jobs');
        setJobs(data);
    } catch (error) {
        console.error("Could not fetch jobs", error);
    }
};

useEffect(() => {
    if (userInfo) {
        fetchJobs();
    }
}, [userInfo]);

const showNotification = (message, type) => {
    setNotification({ message, type });
};

return (
    <div>
        <Notification message={notification.message} type={notification.type} onClear={() => setNotification({ message: '', type: '' })} />
        {userInfo ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <PostJobForm onJobPosted={fetchJobs} onNotification={showNotification} />
                </div>
                <div className="lg:col-span-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-cyan-400">Live Job Feed</h2>
                        <div className="space-y-6">
                            {jobs.length > 0 ? jobs.map(job => (
                                <JobItem key={job._id} job={job} />
                            )) : <p>No jobs found.</p>}
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="text-center bg-gray-800 p-12 rounded-lg">
                <h2 className="text-3xl font-bold mb-4 text-cyan-400">Welcome to the Portal</h2>
                <p className="text-gray-300">Please log in or register to view and post jobs.</p>
            </div>
        )}
    </div>
);
}

export default HomePage;