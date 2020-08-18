import React from 'react';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const AppBarSection = ({ children, className }) => {
  return <Wrapper className={className}>{children}</Wrapper>;
};

export default AppBarSection;
