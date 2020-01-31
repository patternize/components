// src/components/button/Button.tsx

import * as React from "react";

interface IProps {
  /**
   * CSS properties
   */
  size: "regular" | "large";
  children: React.ReactNode;
  onClick?: () => void;
}

export class Button extends React.PureComponent<IProps> {
  render() {
    const { size, children, onClick, ...rest } = this.props;
    return (
      <button
          onClick={onClick}
        {...rest}
        style={{
          border: "none",
          padding: size === "regular" ? "8px 12px" : "12px 16px",
          margin: "4px",
          background: "green",
          borderRadius: "4px",
          color: "white"
        }}
      >
        {children}
      </button>
    );
  }

  static defaultProps = {
    size: "regular"
  };
}
