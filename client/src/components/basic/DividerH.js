import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Divider = styled.div`
  min-width: 100%;
  border-top: ${({ thickness }) => thickness}px solid #c0c0c0;
`;

const DividerH = ({ thickness }) => {
  return <Divider thickness={thickness} />;
};

DividerH.defaultProps = {
  thickness: "1"
};

const { string } = PropTypes;
DividerH.propTypes = {
  thickness: string
};

export default DividerH;
