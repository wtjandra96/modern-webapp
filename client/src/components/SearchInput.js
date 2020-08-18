import React, { useState } from 'react';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #c0c0c0;
  border-radius: 15px;
  padding: 4px 16px;

  ${({ isFocused }) => isFocused && "box-shadow: 0 0 1px 1px black"};
`;

const Input = styled.input`
  font-size: 14px;
  height: 24px;
  flex-grow: 1;
  border: 0;
  width: 0px;
  margin-left: 12px;

  &:focus {
    outline: 0;
  }
`;

const SearchInput = (props) => {
  const { placeholder, value } = props;
  const { onChange } = props;

  const [hasFocus, setHasFocus] = useState(false);
  return (
    <Wrapper isFocused={hasFocus}>
      <FontAwesomeIcon icon={faSearch} />
      <Input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
      />
    </Wrapper>
  );
};

export default SearchInput;
