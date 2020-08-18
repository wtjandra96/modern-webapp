import React from 'react';

import styled from 'styled-components';

const Wrapper = styled.div`
  width: ${({ width }) => (width || '0') + 'px'};
  height: ${({ height }) => (height || '0') + 'px'};
  flex-shrink: 0;
  flex-grow: 0;
`;

const Space = ({ width, height }) => {
  return <Wrapper width={width} height={height} />;
};

export default Space;
