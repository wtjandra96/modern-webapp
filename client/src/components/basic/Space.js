import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.div`
  width: ${({ width }) => width + "px"};
  height: ${({ height }) => height + "px"};
  flex-shrink: 0;
  flex-grow: 0;
`;

const Space = ({ width, height }) => {
  return <Wrapper width={width} height={height} />;
};

Space.defaultProps = {
  width: "0",
  height: "0"
};

const { string } = PropTypes;
Space.propTypes = {
  width: string,
  height: string
};

export default Space;
