import React from 'react';
//import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/routes';

// import Navbar from './components/Navbar';
// import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <AppRoutes/>
    </Router>
  );
}

export default App;
