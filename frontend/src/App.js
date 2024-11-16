import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';

const App = () => {
  const [isAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup/>} />

        <Route 
          path='/' 
          element={<ProtectedRoute isAuthenticated={isAuthenticated} />}
        >
          <Route path='/' element={<Home />} />
        </Route>  

      </Routes>
    </Router>
  );
}

export default App;
