import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.input`
  flex-grow: 1;
  border-radius: 4px;
  border: 1px solid #c0c0c0;
  font-size: 16px;
  min-height: 36px;
`;

const Input = props => {
  const { type, autoComplete, value, onChange, placeholder } = props;
  return (
    <Wrapper
      type={type}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

Input.defaultProps = {
  type: "text",
  autoComplete: "off",
  value: "",
  onChange: null,
  placeholder: ""
};

const { func, string } = PropTypes;
Input.propTypes = {
  type: string,
  autoComplete: string,
  value: string,
  onChange: func,
  placeholder: string
};

export default Input;
