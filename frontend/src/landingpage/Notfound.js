import React from 'react';
import { Link } from 'react-router-dom';
function Notfound() {
    return ( 
         <div class='container p-5 mb-5'>
            <div class='row text-center'>
                <h1 class='mt-5'>404 Not Found </h1>
                <p>Sorry, the page you are looking for does not exist insted you can click on go home to get on correct page</p>
                <Link to="/"><button class='p-2 btn btn-primary fs-5 mb-5'style={{width:"20%", margin:"0 Auto"}}>Connect to Home Page</button></Link>
            </div>
        </div>
     );
}

export default Notfound;