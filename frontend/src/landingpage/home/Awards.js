import React from 'react';

function Awards() {
    return ( 
        <div class='container'>
            <div class='row'>
                <div class='col-6 p-5' >
                    <img src='media/images/largestBroker.svg'/>
                </div>
                <div class='col-6 p-5 mt-3'>
                    <h1>Largest Stock Broker in India</h1>
                    <p class='mb-5'>2+ million stockers client contributes to over 15% of all retail order volumes in India daily by trading and investing in:</p>
                    <div class='row'>
                        <div class='col-6'>
                            <ul>
                                <li>
                                    <p>Future and Options</p>
                                </li>
                                <li>
                                    <p>Commodity Derivatives</p>
                                </li>
                                <li>
                                    <p>Currency Derivatives</p>
                                </li>
                            </ul>
                        </div>
                        <div class='col-6'>
                            <ul>
                                <li>
                                    <p>Stocks & IPOs</p>
                                </li>
                                <li>
                                    <p>Direct mutual funds</p>
                                </li>
                                <li>
                                    <p>Bonds and Government Securities </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                     <img src='media\images\pressLogos.png' style={{width:"90%"}}/>
                </div>
            </div>
        </div>
     );
}

export default Awards;