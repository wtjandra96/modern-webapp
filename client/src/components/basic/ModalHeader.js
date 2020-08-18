import React from 'react'

import styled from "styled-components"

const Wrapper = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
`

const ModalHeader = ({ children }) => {
  return (
    <Wrapper>
      {children}
    </Wrapper>
  )
}

export default ModalHeader
