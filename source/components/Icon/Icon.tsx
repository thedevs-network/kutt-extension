import React from 'react';

import StarYellow from './StarYellow';
import EyeClosed from './EyeClosed';
import StarWhite from './StarWhite';
import Settings from './Settings';
import Refresh from './Refresh';
import Spinner from './Spinner';
import QRCode from './QRCode';
import Cross from './Cross';
import Copy from './Copy';
import Tick from './Tick';
import Zap from './Zap';
import Eye from './Eye';

const icons = {
  copy: Copy,
  cross: Cross,
  eye: Eye,
  'eye-closed': EyeClosed,
  qrcode: QRCode,
  refresh: Refresh,
  settings: Settings,
  spinner: Spinner,
  'star-yellow': StarYellow,
  'star-white': StarWhite,
  tick: Tick,
  zap: Zap,
};

export type Icons = keyof typeof icons;

type Props = {
  name: Icons;
  title?: string;
  stroke?: string;
  fill?: string;
  hoverFill?: string;
  hoverStroke?: string;
  strokeWidth?: string;
  className?: string;
  onClick?: () => void;
};

const Icon: React.FC<Props> = ({name, ...rest}) => {
  return <div {...rest}>{React.createElement(icons[name])}</div>;
};

export default Icon;
