import React from 'react'

import styled from "styled-components"

const Wrapper = styled.div`
  height: 45vh;
  max-height: 45vh;
  width: 100vw;
  z-index: 99;
  background-color: white;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Overlay = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: hsla(0, 0%, 0%, 0.4);
  z-index: 97;
`

const BottomSheet = props => {
  const { children } = props;
  const { closeSheet } = props;
  return (
    <>
      <Overlay onClick={closeSheet} />
      <Wrapper>
        {children}
      </Wrapper>
    </>
  )
}

export default BottomSheet
