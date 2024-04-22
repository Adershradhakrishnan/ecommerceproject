import { useState } from 'react'
import Signup from './components/Signup/Signup';
import Signin from './components/Signin/Signin';
import SellerPage from './components/Seller/Seller';
import GetProduct from './components/Getuser/Getuser';
import MyCarousel from './components/Buyer/Carousel/Carousal';
import Navbar from './components/Buyer/Navbar/Navbar';
import Buyer from './components/Buyer/Buyer';

import { BrowserRouter as Router,Route,Routes,Link } from 'react-router-dom';
import './App.css'

function App() {
  

  return (
    <>
   <Router>
      <div>
        <Routes>
          <Route path='/signup' exact element={<Signup/>}/>
          <Route path='/signin' exact element={<Signin/>}/>
          <Route path='/seller' exact element={<SellerPage/>}/>
          <Route path='/getproducts' exact element={<GetProduct/>}/>
          <Route path='/carousel' exact element={<MyCarousel/>}/>
          <Route path='/navbar' exact element={<Navbar/>}/>
          <Route path='/' exact element={<Buyer/>}/>
          </Routes>
      </div>
     </Router>
    </>
  )
}

export default App
