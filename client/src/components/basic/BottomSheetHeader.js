import React from "react";

import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: 48px;
  padding: 0 12px;
`;

const BottomSheetHeader = ({ children }) => {
  return (
    <Wrapper>
      {children}
    </Wrapper>
  );
};

export default BottomSheetHeader;
