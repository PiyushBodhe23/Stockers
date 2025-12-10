import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import './index.css';

import Homepage from './landingpage/home/Homepage';
import Signup from "./landingpage/signup/Signup";
import Aboutpage from "./landingpage/about/Aboutpage";
import Productpage from './landingpage/product/Productpage';
import Pricingpage from './landingpage/pricing/Pricingpage';
import Supportpage from './landingpage/support/Supportpage';

import Navbar from './landingpage/Navbar';
import Footer from './landingpage/Footer';
import Notfound from './landingpage/Notfound';

import Login from "./landingpage/signup/login";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage />}/>
        <Route path="/signup" element={<Signup />}/>
        <Route path="/about" element={<Aboutpage />}/>
        <Route path="/product" element={<Productpage />}/>
        <Route path="/pricing" element={<Pricingpage />}/>
        <Route path="/support" element={<Supportpage />}/>
        <Route path="*" element={<Notfound />}/>
        <Route path="/login" element={<Login />} />
        
      </Routes>
    <Footer/>
  </BrowserRouter>
);