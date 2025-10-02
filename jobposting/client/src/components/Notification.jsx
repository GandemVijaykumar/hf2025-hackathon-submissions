import { useState, useEffect } from 'react';

function Notification({ message, type, onClear }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                setTimeout(onClear, 300);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [message, onClear]);

    if (!visible) return null;

    const baseClasses = "fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white transition-all duration-300";
    const typeClasses = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type] || 'bg-gray-700'} ${visible ? 'opacity-100' : 'opacity-0'}`}>
            {message}
        </div>
    );
}

export default Notification;