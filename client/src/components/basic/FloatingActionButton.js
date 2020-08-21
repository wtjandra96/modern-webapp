import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.div`
	cursor: pointer;

	font-size: 20px;
	font-weight: 500;

	color: ${({ color }) => color};
	background-color: ${({ bgColor }) => bgColor};

	display: ${({ show }) => show ? "flex" : "none"};
	justify-content: center;
	align-items: center;

	border-radius: 50%;
	width: ${({ size }) => size + "px"};
	height: ${({ size }) => size + "px"};

	position: fixed;
	bottom:78px;
	right: 16px;
	z-index: 50;

	@media (min-width: 600px) {
		display: none;
	}
`;

const FloatingActionButton = props => {
	const { className } = props;
	const { children } = props;
	const { onClick } = props;
	const { size, color, show, bgColor } = props;
	
	return (
		<Wrapper role="button"
			className={className}
			onClick={onClick}
			size={size}
			color={color}
			bgColor={bgColor}
			show={show}
		>
			{children}
		</Wrapper>
	);
};

FloatingActionButton.defaultProps = {
	onClick: null,
	show: false,
	color: "white",
	bgColor: "#424242",
	size: "64"
};

const { bool, func, string } = PropTypes;
FloatingActionButton.propTypes = {
	onClick: func,
	show: bool,
	size: string,
	color: string,
	bgColor: string
};

export default FloatingActionButton;
