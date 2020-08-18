import React from 'react';

import styled from 'styled-components';

const Divider = styled.div`
  min-height: 100%;
  border-left: ${({ thickness }) => thickness || "1"}px solid #c0c0c0;
`;

const DividerV = ({ thickness }) => {
  return <Divider thickness={thickness} />;
};

export default DividerV;
