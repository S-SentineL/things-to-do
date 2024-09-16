import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ToDoList from './components/ToDoList';
import Loading from './components/Loading'
import './styles/index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return(
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/loading' element={<Loading/>}/>  
          <Route path='/todolist' element={<ToDoList/>}/>        
        </Routes>
      </Router>
    </div>
  );
}

export default App;

