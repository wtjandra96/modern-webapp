import React from 'react'

import styled from "styled-components"

const Wrapper = styled.div`
	display: flex;
	align-items: center;
  font-size: ${({ fontSize }) => fontSize + "px"};
  font-weight: ${({ fontWeight }) => fontWeight};
  color: ${({ color }) => color};
	${({ cursor }) => cursor && `cursor: ${cursor};`}

	&:focus {
		outline: 0;
		text-decoration: underline;
	}

	&:hover {
		${({ cursor }) => cursor === "pointer" && "text-decoration: underline;"}
	}
`;

const Text = props => {
	const { children } = props;
	const { fontSize, fontWeight, color, cursor, onClick } = props;
	return (
		<Wrapper
			fontSize={fontSize}
			fontWeight={fontWeight}
			color={color}
			cursor={cursor}
			tabIndex={onClick && "0"}
			onClick={onClick}
		>
			{children}
		</Wrapper>
	)
}

export default Text
