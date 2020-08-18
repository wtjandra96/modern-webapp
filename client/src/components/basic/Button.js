import React from 'react'

import styled from "styled-components"

const Wrapper = styled.div`
	cursor: pointer;

	background-color: ${({ color }) => color || "lightgray"};

  text-align: center;
	font-weight: 500;

	border-radius: ${({ borderRadius }) => {
		if (!borderRadius) return "4px";
		if (borderRadius.includes("%")) {
			return borderRadius;
		}
		return borderRadius + "px";
	}};

	width: ${({ size }) => size === "full" ? "100%" : "fit-content"};

	${({ size }) =>
		size === "small" ? "padding: 4px 6px" :
			size === "large" || size === "full" ? "padding: 10px 20px" :
				"padding: 6px 18px"};
`;

const Button = props => {
	const { className } = props;
	const { children } = props;
	const { onClick } = props;
	const { size, borderRadius, color } = props;

	return (
		<Wrapper role="button"
			className={className}
			onClick={onClick}
			borderRadius={borderRadius}
			color={color}
			size={size}
		>
			{children}
		</Wrapper>
	)
}

export default Button
