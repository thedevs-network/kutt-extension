import React from 'react';

import StarYellowIcon from './StarYellow';
import EyeClosedIcon from './EyeClosed';
import StarWhiteIcon from './StarWhite';
import SettingsIcon from './Settings';
import RefreshIcon from './Refresh';
import SpinnerIcon from './Spinner';
import QRCodeIcon from './QRCode';
import CrossIcon from './Cross';
import ClockIcon from './Clock';
import CopyIcon from './Copy';
import TickIcon from './Tick';
import ZapIcon from './Zap';
import EyeIcon from './Eye';

const icons = {
  clock: ClockIcon,
  copy: CopyIcon,
  cross: CrossIcon,
  eye: EyeIcon,
  'eye-closed': EyeClosedIcon,
  qrcode: QRCodeIcon,
  refresh: RefreshIcon,
  settings: SettingsIcon,
  spinner: SpinnerIcon,
  'star-yellow': StarYellowIcon,
  'star-white': StarWhiteIcon,
  tick: TickIcon,
  zap: ZapIcon,
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
