import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import type { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: IconName;
  type: IconPrefix;
  color?: string;
}

library.add(fas);
library.add(fab);

export const Icon = ({ name, type, color, ...props }: IProps) => {
  return (
    <span className="icon" {...props}>
      <FontAwesomeIcon icon={[type, name]} style={{ color: color }} />
    </span>
  );
};