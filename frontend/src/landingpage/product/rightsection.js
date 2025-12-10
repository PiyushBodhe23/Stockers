import React from 'react';

function rightsection({ imageURL, productName, productDescription, learnMore, googlePlay, appStore }) {
    return (
        <div class='container'>
            <div class='row p-5'>
                <div class='col-5 p-5 mt-5'>
                    <h1>{productName}</h1>
                    <p>{productDescription}</p>
                    <div>
                        <a href={learnMore} style={{marginleft:"50px",paddingLeft:"10px", paddingRight:"10px"}}>learn More<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
                    </div>
                    <div class="mt-3">
                        <a href={googlePlay}><img src="media/images/googlePlayBadge.svg" /></a>
                        <a href={appStore}><img src="media/images/appstoreBadge.svg"/>
                        </a>
                    </div>
                </div>
                
                <div class='col-1'></div>

                <div class='col-6 p-3'>
                    <img src={imageURL} />
                </div>
            </div>
        </div>

    );
}

export default rightsection;