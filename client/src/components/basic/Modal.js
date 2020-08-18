import React from 'react'

import styled from "styled-components"

const ModalContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  pointer-events: none;
  z-index: 99;
  top: 0;
  left: 0;
`

const Wrapper = styled.div`
  flex-grow: 1;
  max-width: 500px;
  height: 360px;
  max-height: 360px;
  background-color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: all;
  border-radius: 4px;
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

const Modal = props => {
  const { children } = props;
  const { closeModal } = props;
  return (
    <>
      <Overlay onClick={closeModal} />
      <ModalContainer>
        <Wrapper>
          {children}
        </Wrapper>
      </ModalContainer>
    </>
  )
}

export default Modal
