import React from 'react';
import Awards from './Awards';
import Pricing from './Pricing';
import Education from './Education';
import Openaccount from '../Openaccount';
import Hero from './Hero';
import Stats from './Stats';

function Homepage() {
    return ( 
        <>
        <Hero/>
        <Awards/>
        <Stats/>
        <Pricing/>
        <Education/>
        <Openaccount/>
        </>
        
     );
}

export default Homepage;