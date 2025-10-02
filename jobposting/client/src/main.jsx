// 1. Import React to use its features like StrictMode
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // 2. The single, top-level StrictMode wrapper
  <React.StrictMode>
    
    {/* 3. BrowserRouter enables routing for the whole app */}
    <BrowserRouter>

      {/* 4. AuthProvider makes auth state available to the whole app */}
      <AuthProvider>

        {/* 5. The App component is rendered only once, inside all the providers */}
        <App />
        
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);