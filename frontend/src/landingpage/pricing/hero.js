import React from 'react';
function hero() {
    return (
        <div class='container '>
            <div class='row p-5 border-bottom text-center'>
                <h1 style={{marginTop:"100px"}}>Charges</h1>
                <h3  class="text-muted fs-4">
                List of all charges and taxes
                </h3>
            </div>
              <div class='row p-5 mt-5 text-center'>
                <div class="col-4 p-5">
                    <img src="media/images/pricingEquity.svg"/>
                    <h1 class="fs-3">Free equity delivery</h1>
                    <p class="text-muted">
                        All equity delivery investments (NSE, BSE), are absolutely free — ₹ 0 brokerage.
                    </p>
                </div>

                <div class="col-4  p-5">
                     <img src="media/images/intradayTrades.svg"/>
                    <h1 class="fs-3">Intraday and F&O trades</h1>
                    <p class="text-muted">
                        Flat ₹ 20 or 0.03% (whichever is lower) per executed order on intraday trades across equity, currency, and commodity trades. Flat ₹20 on all option trades.
                    </p>
                </div>

                <div class="col-4  p-5">
                     <img src="media/images/pricingEquity.svg"/>
                    <h1 class="fs-3"> Free direct MF</h1>
                    <p class="text-muted">
                        All direct mutual fund investments are absolutely free — ₹ 0 commissions & DP charges.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default hero;