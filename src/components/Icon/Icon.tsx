import React from 'react';

import Copy from './Copy';
import Tick from './Tick';
import Cross from './Cross';
import QRCode from './QRCode';
import Spinner from './Spinner';
import Refresh from './Refresh';
import Settings from './Settings';
import ArrowLeft from './ArrowLeft';

const icons = {
    arrowleft: ArrowLeft,
    copy: Copy,
    cross: Cross,
    qrcode: QRCode,
    refresh: Refresh,
    settings: Settings,
    spinner: Spinner,
    tick: Tick,
};

export type Icons = keyof typeof icons;

type Props = {
    name: Icons;
    stroke?: string;
    fill?: string;
    hoverFill?: string;
    hoverStroke?: string;
    strokeWidth?: string;
    className?: string;
};

const Icon: React.FC<Props> = ({ name, ...rest }) => {
    return <div {...rest}>{React.createElement(icons[name])}</div>;
};

export default Icon;
