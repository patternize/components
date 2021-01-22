import * as React from 'react';

import useStyles from './Button.style';

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
  secondary?: boolean;
  warning?: boolean;
  disabled?: boolean;
  type?: string;
  color?: string;
  round?: boolean;
  inverted?: boolean;
  vector?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick = () => {},
  primary = false,
  secondary = false,
  warning = false,
  disabled = false,
  type = 'button',
  color = '',
  round = false,
  inverted = false,
  vector = null
}: ButtonProps) => {
  const classes = useStyles({ color });

  const handleClick = () => {
    if (!disabled && onClick) onClick();
  };

  const rootProps = {
    className: classes.root,
    onClick: handleClick,
    type,
    disabled,
    'data-is-primary': primary,
    'data-is-secondary': secondary,
    'data-is-warning': warning,
    'data-is-round': round,
    'data-is-inverted': !primary && !secondary && !warning && inverted
  };

  return (
    <button {...rootProps}>
      {vector && <span className={classes.vector}>{vector}</span>}
      <span className={classes.text}>{children}</span>
    </button>
  );
};

export default Button;
