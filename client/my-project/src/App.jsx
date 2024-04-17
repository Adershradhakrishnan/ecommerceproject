import { useState } from 'react'
import Signup from './components/Signup/Signup';
import Signin from './components/Signin/Signin';
import { BrowserRouter as Router,Route,Routes,Link } from 'react-router-dom';
import './App.css'

function App() {
  

  return (
    <>
   <Router>
      <div>
        <Routes>
          <Route path='/' exact element={<Signup/>}/>
          <Route path='/signin' exact element={<Signin/>}/>
          </Routes>
      </div>
     </Router>
    </>
  )
}

export default App
