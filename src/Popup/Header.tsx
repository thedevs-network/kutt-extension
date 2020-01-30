import React from 'react';

import Icon from '../components/Icon';

const Header = (): JSX.Element => {
    return (
        <>
            <header id="header">
                <div className="logo__holder">
                    <img src="assets/logo.png" alt="logo" style={{ width: '22px', height: '22px' }} />
                </div>
                <div className="action__buttons--holder">
                    <Icon name="settings" className="icon" />
                </div>
            </header>
        </>
    );
};

export default Header;
