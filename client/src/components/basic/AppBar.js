import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  height: 56px;
  max-height: 56px;
  position: ${({ position }) => position};
  top: 0;
	background-color: white;
  ${({ border }) => border && "border-bottom: 1px solid #c0c0c0;"}
`;

const AppBar = props => {
  const { children } = props;
  const { className } = props;
  const { position, border } = props;

  return (
    <Wrapper className={className} position={position} border={border}>
      {children}
    </Wrapper>
  );
};

AppBar.defaultProps = {
  border: true,
  position: "sticky"
};

const { bool, string } = PropTypes;
AppBar.propTypes = {
  border: bool,
  position: string
};

export default AppBar;
