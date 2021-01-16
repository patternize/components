import * as React from 'react';
import styles from './Button.module.scss';

const { useEffect } = React;

export interface ButtonProps {
  /**
    Children of the Button
   */
  children: React.ReactNode;
  /**
    OnClick Action that defines what happens when the user clicks on the Button
   */
  onClick?: () => void;
  /**
    Whether or not this Button is disabled
   */
  disabled?: boolean;
}

export const Button = ({
  children,
  onClick,
  disabled
}: ButtonProps): JSX.Element => {
  useEffect(() => {
    document.addEventListener('keydown', (event) => {
      event.stopPropagation();
    });
  });

  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.button}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
