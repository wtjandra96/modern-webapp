import React from 'react';

import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 6px 8px;
  font-size: 14px;
  min-width: 0;
  white-space: nowrap;
  color: #303030;
  display: flex;
  pointer-events: fill;
  ${({ width }) => width && `width: ${width}px;`}
  cursor: ${({ cursor }) => cursor || 'pointer'};
  &:hover {
    background-color: ${({ hoverBgColor }) => hoverBgColor || '#f2f2f2'};
  }
  ${({ center }) => center && "justify-content: center;"}
  z-index: 9999999;
`;

const DropdownItem = (props) => {
  const { children } = props;
  const { onClick } = props;
  const { cursor, hoverBgColor, width, center } = props;
  return (
    <Wrapper
      cursor={cursor}
      onClick={onClick}
      hoverBgColor={hoverBgColor}
      width={width}
      center={center}
    >
      {children}
    </Wrapper>
  );
};

export default DropdownItem;
