import React from 'react';
function Hero() {
    return (
        <section class='container-fluid' id="SupportHero">
            <div class="p-5" id="SupportWrapper">
                <h4> Support Portal</h4>
                <a href="">Track Tickets</a>
            </div>

            <div class="row p-3 m-3">
            <div class="col-1 p-5"></div>
            <div class="col-5 p-5">
                <h1 class="fs-3">Search for an answer or browse help topics to create a Tickets</h1>
                <form>
                    <input placeholder="EG. How do i activate F&Q"  />
                </form>
                <br />
                <a href=""> Track account Opening</a>
                <a href="">Track Segment Activation</a>
                <a href="">Intraday margin </a>
                <a href="">Kite user manual</a>
            </div>
            <div class="col-1 p-5"></div>
             <div class="col-5 p-5">
                <h1 class="fs-3">Featured</h1>
                <ol>
                    <li><a href="">Current Takeovers and Delisting - January 2024</a>
               </li>
                    <li> <a href="">Latest Intraday leverages - MIS & CO</a></li>
                </ol>
                 
             </div>
            </div>
        </section>
    );
}

export default Hero;