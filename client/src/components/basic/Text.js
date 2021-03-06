import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.div`
	display: flex;
	align-items: center;
  font-size: ${({ fontSize }) => fontSize + "px"};
  font-weight: ${({ fontWeight }) => fontWeight};
  color: ${({ color }) => color};
	${({ cursor }) => cursor && `cursor: ${cursor};`}
	${({ centerText }) => centerText && "justify-content: center;"}

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
	const { onClick } = props;
	const { fontSize, fontWeight, color, cursor, centerText } = props;
	return (
		<Wrapper
			fontSize={fontSize}
			fontWeight={fontWeight}
			color={color}
			cursor={cursor}
			tabIndex={onClick && "0"}
			onClick={onClick}
			centerText={centerText}
		>
			{children}
		</Wrapper>
	);
};

Text.defaultProps = {
	onClick: null,
	fontSize: null,
	fontWeight: null,
	color: null,
	cursor: null,
	centerText: false
};

const { func, string, bool } = PropTypes;
Text.propTypes = {
	onClick: func,
	fontSize: string,
	fontWeight: string,
	color: string,
	cursor: string,
	centerText: bool
};

export default Text;
