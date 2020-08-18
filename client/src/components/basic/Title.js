import React from 'react'

import styled from "styled-components"

const Wrapper = styled.div`
	font-size: 28px;
	font-weight: 500;
`;

const Title = ({ children }) => {
	return (
		<Wrapper>
			{children}
		</Wrapper>
	)
}

export default Title;
