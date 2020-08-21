import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.div`
  cursor: ${({ cursor }) => cursor};
  min-height: 48px;
  min-width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
  width: min-content;
  &:hover {
    color: #A0A0A0;
  }

  @media (min-width: 860px) {
    justify-content: flex-start;
    padding: 0 16px;
    width: 100%;
  }
`;

const SideNavItem = props => {
  const { children } = props;
  const { onClick } = props;
  const { width, color, cursor } = props;

  return (
    <Wrapper role="link"
      cursor={cursor}
      width={width}
      color={color}
      onClick={onClick}
    >
      {children}
    </Wrapper>
  );
};

SideNavItem.defaultProps = {
  onClick: null,
  width: null,
  color: "#424242",
  cursor: "pointer"
};

const { func, string } = PropTypes;
SideNavItem.propTypes = {
  onClick: func,
  width: string,
  color: string,
  cursor: string
};

export default SideNavItem;
