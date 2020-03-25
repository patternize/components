import * as React from "react";
import "./Button.scss";
const { useEffect } = React;
interface IProps {
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

export const Button = ({ children, onClick, disabled}: IProps): JSX.Element => {
  useEffect(() => {
    document.addEventListener("keydown", event => {
      event.stopPropagation();
      console.log('key pressed', event);
    });
  });
  return (
    <button
        onClick={onClick}
        className={'pat-button'}
        disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;