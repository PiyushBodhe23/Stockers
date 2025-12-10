import React from 'react';
function Education() {
  return (
    <div class='container mt-10'>
      <div class='row'>
        <div class='col-6'>
          <img src='media/images/education.png' style={{width:"70%"}}/>
        </div>
        <div class='col-6'>
          <h1 class='mb-3 fs-2 mt-5'>Free and open market education</h1>

          <p>Learnexa, the largest online stock market education book in the world covering everything from the basics to advanced trading.</p>
          <a href =''class='mx-5'style={{textDecoration:"none"}}>Learnexa<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>

          <p class='mt-5'>TradingQ&A, the most active trading and investment community in India for all your market related queries.</p>
          <a href =''class='mx-5'style={{textDecoration:"none"}}>Trading Q&A<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
        </div>          
      </div>
    </div>
  );
}

export default Education;