import React from 'react';
import './App.css';

import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/routes';
import { getAllBook } from './api/BookAPI';

// import Navbar from './components/Navbar';
// import Footer from './components/Footer';

function App() {
  getAllBook().then().catch();

  return (
    <Router>
      <AppRoutes/>
    </Router>
  );
}

export default App;
