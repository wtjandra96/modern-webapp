import React from 'react';

import styled from 'styled-components';

const Divider = styled.div`
  min-width: 100%;
  border-top: ${({ thickness }) => thickness || "1"}px solid #c0c0c0;
`;

const DividerH = ({ thickness }) => {
  return <Divider thickness={thickness} />;
};

export default DividerH;
