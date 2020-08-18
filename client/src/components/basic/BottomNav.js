import React from 'react'

import styled from "styled-components";

const Wrapper = styled.div`
  height: 56px;
  flex-shrink: 0;
  width: 100%;
  left: 0;
  border-top: 1px solid #c0c0c0;
  bottom: 0;
  position: sticky;
  display: flex;
`;

const BottomNav = ({ children }) => {
  return (
    <Wrapper>
      {children}
    </Wrapper>
  )
}

export default BottomNav
