import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const TouchArea = styled.div`
  background-color: transparent;
  outline: 0;
  border: 0;
  flex-grow: 0;
  width: min-content;
  padding: ${({ touchRadius }) => touchRadius + "px"};
  margin: -${({ touchRadius }) => touchRadius + "px"};
  border-radius: 100%;
  transition: background-color 0.1s;

  &:hover {
    ${({ button }) => button && "background-color: hsla(0, 0%, 90%, .5)"};
    cursor: ${({ button }) => button && "pointer"};
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ fontSize }) => fontSize + "px"};
  width: ${({ size, width }) => (width || size || "24") + "px"};
  height: ${({ size, height }) => (height || size || "24") + "px"};
  color: ${({ color }) => color};
  &:hover {
    cursor: ${({ button }) => button && "pointer"};
    color: ${({ hoverColor }) => hoverColor};
  }
`;

const Icon = props => {
  const { className } = props;
  const { children } = props;
  const { onClick, onMouseDown } = props;
  const {
    touchRadius,
    button,
    fontSize,
    size,
    width,
    height,
    color,
    hoverColor
  } = props;

  return (
    <TouchArea
      className={className}
      onMouseDown={onMouseDown}
      onClick={onClick}
      touchRadius={touchRadius}
      role="button"
      tabIndex="0"
      button={button}
    >
      <Wrapper
        fontSize={fontSize}
        size={size}
        width={width}
        height={height}
        color={color}
        hoverColor={hoverColor}
      >
        {children}
      </Wrapper>
    </TouchArea>
  );
};

Icon.defaultProps = {
  onClick: null,
  onMouseDown: null,
  touchRadius: "4",
  button: true,
  size: null,
  width: null,
  height: null,
  fontSize: null,
  color: null,
  hoverColor: null
};

const { func, string, bool } = PropTypes;
Icon.propTypes = {
  onClick: func,
  onMouseDown: func,
  touchRadius: string,
  button: bool,
  fontSize: string,
  size: string,
  width: string,
  height: string,
  color: string,
  hoverColor: string
};

export default Icon;
