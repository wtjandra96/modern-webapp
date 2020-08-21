import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

const Wrapper = styled.div`
  padding: 6px 8px;
  font-size: 14px;
  min-width: 0;
  white-space: nowrap;
  color: #303030;
  display: flex;
  pointer-events: fill;
  ${({ width }) => width && `width: ${width}px;`}
  cursor: ${({ cursor }) => cursor};
  &:hover {
    background-color: ${({ hoverBgColor }) => hoverBgColor};
  }
  ${({ center }) => center && "justify-content: center;"}
  z-index: 150;
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

DropdownItem.defaultProps = {
  onClick: null,
  cursor: "pointer",
  hoverBgColor: "#f2f2f2",
  width: null,
  center: false
};

const { string, func, bool } = PropTypes;
DropdownItem.propTypes = {
  onClick: func,
  cursor: string,
  hoverBgColor: string,
  width: string,
  center: bool
};

export default DropdownItem;
