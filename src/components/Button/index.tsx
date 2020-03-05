import * as React from "react";
import "./Button.scss";

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

export class Button extends React.PureComponent<IProps> {
  componentDidMount(){
    document.addEventListener("keydown", event => {
      event.stopPropagation();
      console.log('key pressed', event);
    });
  }
  render() {
    const { children, onClick, disabled, ...rest} = this.props;
    return (
      <button
          onClick={onClick}
          className={'pat-button'}
          disabled={disabled}
          {...rest}
      >
        {children}
      </button>
    );
  }
}
