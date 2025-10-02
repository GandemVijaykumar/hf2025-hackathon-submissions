import React from 'react';

function JobItem({ job }) {
    const getMatchColor = (score) => {
        if (score > 75) return 'bg-green-500';
        if (score > 40) return 'bg-yellow-500';
        return 'bg-red-500';
    }
    
    return (
        <div className="bg-gray-700 p-5 rounded-lg border border-gray-600">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white">{job.title}</h3>
                    <p className="text-sm text-gray-400">by {job.author.name}</p>
                </div>
                {job.matchScore !== undefined && (
                     <div className="text-right">
                         <span className={`text-xs font-bold px-2 py-1 rounded-full text-white ${getMatchColor(job.matchScore)}`}>
                             {job.matchScore}% Match
                         </span>
                    </div>
                )}
            </div>
            <p className="text-gray-300 mt-2 text-sm">{job.description}</p>
            <div className="flex justify-between items-end mt-4">
                <div className="flex flex-wrap gap-2">
                    {job.skills.map(skill => (
                        <span key={skill} className="bg-gray-600 text-cyan-300 text-xs font-semibold px-2.5 py-1 rounded-full">{skill}</span>
                    ))}
                </div>
                <span className="text-lg font-semibold text-green-400">${job.budget}</span>
            </div>
        </div>
    );
}

export default JobItem;