import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Divider = styled.div`
  min-height: 100%;
  border-left: ${({ thickness }) => thickness}px solid #c0c0c0;
`;

const DividerV = ({ thickness }) => {
  return <Divider thickness={thickness} />;
};

DividerV.defaultProps = {
  thickness: "1"
};

const { string } = PropTypes;
DividerV.propTypes = {
  thickness: string
};

export default DividerV;
