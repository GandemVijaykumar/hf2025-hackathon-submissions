import { useState } from 'react';
import { ethers } from 'ethers'; // <-- Import ethers
import api from '../services/api';

// IMPORTANT: This should match the address in your backend .env file
const ADMIN_WALLET_ADDRESS = "0x29A3dED2402E416Ec301D225009875142Ce84F32";

function PostJobForm({ onJobPosted, onNotification }) {
    const [details, setDetails] = useState({ title: '', description: '', skills: '', budget: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!details.title || !details.description || !details.skills || !details.budget) {
            onNotification("All fields are required.", "error");
            return;
        }

        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
            onNotification("MetaMask is required for payments.", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            // ==========================================================
            // BLOCKCHAIN PAYMENT LOGIC
            // ==========================================================
            
            // 1. Connect to the user's wallet via MetaMask
            const provider = new ethers.BrowserProvider(window.ethereum);
            // Request account access if needed
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();

            onNotification("Please confirm payment in MetaMask.", "info");

            // 2. Define the transaction details
            const tx = await signer.sendTransaction({
                to: ADMIN_WALLET_ADDRESS,
                value: ethers.parseEther("0.001") // The fee (0.001 ETH)
            });

            // 3. Wait for the transaction to be confirmed on the blockchain
            await tx.wait();
            
            // ==========================================================
            // END OF BLOCKCHAIN LOGIC
            // ==========================================================

            onNotification("Payment successful! Posting job...", "info");

            // 4. If payment is successful, send data to your backend
            const jobData = {
                ...details,
                skills: details.skills.split(',').map(s => s.trim()),
                paymentTxHash: tx.hash // Include the transaction hash as proof
            };
            await api.post('/jobs', jobData);

            onNotification("Job posted successfully!", "success");
            setDetails({ title: '', description: '', skills: '', budget: '' });
            onJobPosted(); // Refresh job list
        } catch (error) {
            console.error(error);
            onNotification(error.reason || "An error occurred during payment or posting.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Post a New Job</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Form fields are the same */}
                <div>
                    <label>Title</label>
                    <input type="text" name="title" value={details.title} onChange={handleChange} required className="w-full bg-gray-700 p-2 rounded"/>
                </div>
                 <div>
                    <label>Description</label>
                    <textarea name="description" value={details.description} onChange={handleChange} required className="w-full bg-gray-700 p-2 rounded"></textarea>
                </div>
                 <div>
                    <label>Skills (comma-separated)</label>
                    <input type="text" name="skills" value={details.skills} onChange={handleChange} required className="w-full bg-gray-700 p-2 rounded"/>
                </div>
                 <div>
                    <label>Budget (USD)</label>
                    <input type="number" name="budget" value={details.budget} onChange={handleChange} required className="w-full bg-gray-700 p-2 rounded"/>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-500 py-2 rounded disabled:bg-gray-500">
                    {isSubmitting ? 'Processing...' : 'Pay 0.001 ETH & Post Job'}
                </button>
            </form>
        </div>
    );
}

export default PostJobForm;