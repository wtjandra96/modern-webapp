import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Space from "./basic/Space";

const Wrapper = styled.div`
  display: flex;
`;

const Color = styled.div`
  border: 1px solid hsla(0, 0%, 50%, 0.3);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${({ color }) => color};
`;

const Input = styled.input`
  width: 110px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #c0c0c0;
`;

const ColorPicker = props => {
  const { color, setColor } = props;
  return (
    <Wrapper>
      <Color color={color} />
      <Space width="12" />
      <Input
        type="text"
        value={color}
        onChange={e => setColor(e.target.value)}
        placeholder="Color (e.g. red)"
      />
    </Wrapper>
  );
};

const { string, func } = PropTypes;
ColorPicker.propTypes = {
  color: string.isRequired,
  setColor: func.isRequired
};

export default ColorPicker;
