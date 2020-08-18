import React from 'react'

import styled from "styled-components"

const Wrapper = styled.div`
	cursor: pointer;

	background-color: ${({ color }) => color || "lightgray"};

	display: flex;
	justify-content: center;
	align-items: center;
	
	font-weight: 500;

	border-radius: 50%;
	width: ${({ size }) => (size || "16") + "px"};
	height: ${({ size }) => (size || "16") + "px"};
`;

const CircleButton = props => {
	const { className } = props;
	const { children } = props;
	const { onClick } = props;
	const { size, color } = props;

	return (
		<Wrapper role="button"
			className={className}
			onClick={onClick}
			size={size}
			color={color}
		>
			{children}
		</Wrapper>
	)
}

export default CircleButton
