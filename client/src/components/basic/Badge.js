import React from 'react';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: inline-block;
  background-color: ${({ color }) => color || 'hsl(0, 0%, 50%, 1)'};
  color: ${({ fontColor }) => fontColor || 'white'};
  font-size: 14px;
  font-weight: 500;
  padding: 1px 4px;
  border-radius: 4px;
`;

const Badge = props => {
  const { className } = props;
  const { color, fontColor, children } = props;

  return (
    <Wrapper className={className} color={color} fontColor={fontColor}>
      {children}
    </Wrapper>
  );
};

export default Badge;
