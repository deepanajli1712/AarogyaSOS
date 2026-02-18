import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import authService from "./appwrite/auth";
import {login, logout} from "./store/authSlice";
import { Footer, Header } from './components';
import { Outlet } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import MedicineLookup from './components/MedicineLookup.jsx';
import ChatBot from './components/chatbot.jsx';

function App() {
  const [loading, setLoading] = useState(true);
  const [showMedicineLookup, setShowMedicineLookup] = useState(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({userData}));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gradient-to-b from-gray-100 to-gray-200'>
      <div className='w-full block'>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
        
        {showMedicineLookup && (
          <MedicineLookup onClose={() => setShowMedicineLookup(false)} />
        )}
        
        <button 
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => setShowMedicineLookup(true)}
          aria-label="Open medicine lookup"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  ) : null;
}

export default App;