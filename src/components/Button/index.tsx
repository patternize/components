import * as React from "react";
import "./Button.scss";

interface IProps {
  size?: "regular" | "large";
  children: React.ReactNode;
  onClick?: () => void;
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
    const { children, onClick } = this.props;
    return (
      <button
          onClick={onClick}
          className={'pat-button'}
      >
        {children}
      </button>
    );
  }
}
