import React, { useEffect } from 'react';
import AOS from 'aos';
import './FullPageLoader.css';

function FullPageLoader() {
    useEffect(() => {
        AOS.init();
    }, [])

    return (
        <>
            <div className="fullpage-loader-holder">
                <div className="fullpage-loader">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="shadow"></div>
                    <div className="shadow"></div>
                    <div className="shadow"></div>
                </div>
            </div>
        </>
    );
};

export default FullPageLoader;