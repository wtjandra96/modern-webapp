import React from 'react'

import styled from "styled-components"

const Wrapper = styled.div`
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	overflow-y: auto;
`

const List = ({ children }) => {
	return (
		<Wrapper>
			{children}
		</Wrapper>
	)
}

export default List
