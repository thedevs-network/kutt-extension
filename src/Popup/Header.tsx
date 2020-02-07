import React from 'react';

import Icon from '../components/Icon';
import { openExtOptionsPage } from '../util/settings';

const Header: React.FC = () => {
    return (
        <>
            <header id="header">
                <div className="logo__holder">
                    <img src="assets/logo.png" alt="logo" style={{ width: '22px', height: '22px' }} />
                </div>
                <div className="action__buttons--holder">
                    <button type="button" className="icon" onClick={openExtOptionsPage}>
                        <Icon name="settings" />
                    </button>
                </div>
            </header>
        </>
    );
};

export default Header;
