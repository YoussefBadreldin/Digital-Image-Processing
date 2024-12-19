// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Enhance from './pages/Enhance';
import Compress from './pages/Compress';
import Segment from './pages/Segment';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/enhance" element={<Enhance />} />
                        <Route path="/compress" element={<Compress />} />
                        <Route path="/segment" element={<Segment />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
