import { useState } from 'react'
import Signup from './components/Signup/Signup';
import Signin from './components/Signin/Signin';
import SellerPage from './components/Seller/Seller';
import GetProduct from './components/Getuser/Getuser';

import Buyer from './components/Buyer/Buyer';
import EditProduct from './components/Productdetails/Productdetails';

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
          
          <Route path='/' exact element={<Buyer/>}/>
          <Route path='/getproduct/:productId' exact element={<EditProduct/>}/>
          </Routes>
      </div>
     </Router>
    </>
  )
}

export default App
