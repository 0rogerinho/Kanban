import * as PhosphorsIcons from '@phosphor-icons/react';
import { iconProps } from './type';
import { FunctionComponent } from 'react';

export function Icon({ name, ...props }: iconProps) {
  const iconComponent = PhosphorsIcons[name];

  const Icon = iconComponent as FunctionComponent;

  return Icon ? <Icon {...props} /> : null;
}
