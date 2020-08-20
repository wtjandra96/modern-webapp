import React from 'react';

import styled from 'styled-components';

const TouchArea = styled.div`
  background-color: transparent;
  outline: 0;
  border: 0;
  flex-grow: 0;
  width: min-content;
  padding: ${({ touchRadius }) => (touchRadius || "4") + "px"};
  margin: -${({ touchRadius }) => (touchRadius || "4") + "px"};
  border-radius: 100%;
  transition: background-color 0.1s;

  &:hover {
    ${({ button }) => button && "background-color: hsla(0, 0%, 90%, .5)"};
    cursor: ${({ button }) => button && 'pointer'};
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ fontSize }) => fontSize + 'px'};
  width: ${({ size, width }) => (width || size || '24') + 'px'};
  height: ${({ size, height }) => (height || size || '24') + 'px'};
  color: ${({ color }) => color};
  &:hover {
    cursor: ${({ button }) => button && 'pointer'};
    color: ${({ color, hoverColor }) => (hoverColor ? hoverColor : color)};
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
  button: true
}

export default Icon;
