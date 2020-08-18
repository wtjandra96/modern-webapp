import React from 'react';

import styled from 'styled-components';

const Container = styled.div`
  height: 100vh;
  display: none;
  flex-shrink: 0;

  @media (min-width: 600px) {
    display: block;
    width: 64px;
  }

  @media (min-width: 768px) {
    width: 84px;
    box-sizing: content-box;
  }

  @media (min-width: 860px) {
    width: 276px;
  }
`;

const FixedWrapper = styled.div`
  position: fixed;
  height: 100vh;

  @media (min-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 64px;
  }

  @media (min-width: 768px) {
    width: 84px;
    box-sizing: content-box;
  }

  @media (min-width: 860px) {
    width: 276px;
  }
`;

const SideNav = ({ children }) => {
  return (
    <Container>
      <FixedWrapper>{children}</FixedWrapper>
    </Container>
  );
};

export default SideNav;
