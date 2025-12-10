import React from 'react';
import { Link } from "react-router-dom";

function Openaccount() {
    return ( 
         <div class='container p-5 mb-5'>
            <div class='row text-center'>
                <h1 class='mt-5'>Open a Stockers account </h1>
                <p>Modern platform and apps ,0rs investment, and flat 20rs intraday and F&0=O trades. </p>
                <Link to="/signup">
                    <button className="open-account-button p-2 btn btn-primary fs-5 mb-5" style={{width:"20%", margin:"0 Auto"}}>
                        Open Account
                    </button>
                </Link>
            </div>
        </div>
     );
}

export default Openaccount;