import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

// Outer is to handle onBlur
const Outer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 98;
  cursor: default;
`;

const RelativeWrapper = styled.div`
  position: relative;
  z-index: 99;
`;

const Wrapper = styled.div`
  position: absolute;
  ${({ topOffset }) => topOffset && (`margin-top: -${(parseInt(topOffset))}px`)};
  ${({ bottomOffset }) => bottomOffset && (`margin-top: ${(parseInt(bottomOffset))}px`)};
  margin-right: -4px;
  ${({ rightOffset }) => rightOffset && (`margin-right: ${(parseInt(rightOffset))}px`)};
  ${({ leftOffset }) => leftOffset && (`margin-right: -${(parseInt(leftOffset))}px`)};
  top: 0;
  right: 0;
  z-index: 99;

  background-color: white;
  min-width: 120px;
  border: 1px solid hsla(0, 0%, 0%, 0.25);
  border-radius: 4px;

  box-shadow: 0 3px 6px hsla(0, 0%, 0%, 0.15), 0 1px 4px hsla(0, 0%, 0%, 0.12);
`;

const Dropdown = (props) => {
  const { children } = props;
  const { onBlur } = props;
  const { show, topOffset, bottomOffset, rightOffset, leftOffset } = props;

  const ref = React.createRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref]);
  return (
    <>
      {show && <Outer onClick={e => { e.stopPropagation(); e.preventDefault(); }} />}
      <RelativeWrapper tabIndex="0" onBlur={onBlur} ref={ref}>
        {show && (
          <>
            <Wrapper
              topOffset={topOffset}
              bottomOffset={bottomOffset}
              rightOffset={rightOffset}
              leftOffset={leftOffset}
            >{children}</Wrapper>
          </>
        )}
      </RelativeWrapper>
    </>
  );
};

Dropdown.defaultProps = {
  onBlur: null,
  show: false,
  topOffset: null,
  bottomOffset: null,
  rightOffset: null,
  leftOffset: null
};

const { bool, func, string } = PropTypes;
Dropdown.propTypes = {
  onBlur: func,
  show: bool,
  topOffset: string,
  bottomOffset: string,
  rightOffset: string,
  leftOffset: string
};

export default Dropdown;
