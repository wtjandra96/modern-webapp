import React from 'react'

import styled from "styled-components"

const Wrapper = styled.div`
	cursor: pointer;

	font-size: 20px;
	font-weight: 500;

	color: white;
	background-color: ${({ color }) => color || "#424242"};

	display: ${({ show }) => show ? "flex" : "none"};
	justify-content: center;
	align-items: center;

	border-radius: 50%;
	width: ${({ size }) => (size || "64") + "px"};
	height: ${({ size }) => (size || "64") + "px"};

	position: fixed;
	bottom:78px;
	right: 16px;
	z-index: 50;

	@media (min-width: 600px) {
		display: none;
	}
`;

const FloatingActionButton = React.memo(props => {
	const { className } = props;
	const { children } = props;
	const { onClick } = props;
	const { show } = props;
	const { size, color } = props;
	
	return (
		<Wrapper role="button"
			className={className}
			onClick={onClick}
			size={size}
			color={color}
			show={show}
		>
			{children}
		</Wrapper>
	)
})

export default FloatingActionButton
