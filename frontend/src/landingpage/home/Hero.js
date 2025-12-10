import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
    return ( 
        <div class='container p-5 mb-5'>
            <div class='row text-center mt-5 p-5'>
                <img src='media/images/homeHero.png' class='mb-5'/>
                <h1 class='mt-5'>Invest in Everything </h1>
                <p>Online platform to invest in stocks, derivatives, mutual funds, ETFs, bonds, and more.</p>
                <Link to={"/Signup"}><button class='p-2 btn btn-primary fs-5 mb-5'style={{width:"20%", margin:"0 Auto"}}>Signup Now</button></Link>
            </div>
        </div>
     );
}

export default Hero;