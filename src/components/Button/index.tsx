import * as React from "react";
import "./Button.scss";

interface IProps {
  size: "regular" | "large";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export class Button extends React.PureComponent<IProps> {
  render() {
    const { size, children, onClick, ...rest } = this.props;
    return (
      <button
          onClick={onClick}
          className={'pat-button'}
          {...rest}
      >
        {children}
      </button>
    );
  }

  static defaultProps = {
    size: "regular"
  };
}
