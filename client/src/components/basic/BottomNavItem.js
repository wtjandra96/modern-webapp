import React from 'react'

import styled from "styled-components"

const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`

const BottomNavItem = ({ children }) => {
  return (
    <Wrapper>
      {children}
    </Wrapper>
  )
}

export default BottomNavItem
