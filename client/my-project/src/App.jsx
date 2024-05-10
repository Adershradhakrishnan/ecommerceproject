import { useState } from 'react'
import Signup from './components/Signup/Signup';
import Signin from './components/Signin/Signin';
import SellerPage from './components/Seller/Seller';
import GetProduct from './components/Getuser/Getuser';
import HomePage from './components/Home/Home';
import Buyer from './components/Buyer/Buyer';
import EditProduct from './components/Productdetails/Productdetails';
import CartProduct from './components/Cart/Cart';
// import Mycart from './components/Mycart/Mycart';
import MyCartData from './components/Mycartdata/Mycartdata';
import Order from './components/Order/Order';
import Signout from './components/Signout/Signout';

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
          <Route path='/home' exact element={<HomePage/>}/>
          <Route path='/' exact element={<Buyer/>}/>
          <Route path='/getproduct/:productId' exact element={<EditProduct/>}/>
          <Route path='/cartproduct/:productId' exact element={<CartProduct/>}/>
          {/* <Route path='/mycart' exact element={<Mycart/>}/> */}
          <Route path='/mycart' exact element={<MyCartData/>}/>
           <Route path='/myorder' exact element={<Order/>}/> 
          <Route path='/signout' exact element={<Signout/>}/>
          </Routes>
      </div>
     </Router>
    </>
  )
}

export default App
