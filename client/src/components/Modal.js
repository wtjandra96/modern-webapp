import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import styled from "styled-components";

import { modalActions } from "../state/redux/modal";

const ModalContainer = styled.div`
  width: 100vw;
  height: 100vh;
  z-index: 112;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  pointer-events: none;
  top: 0;
  left: 0;
  padding: 0 12px;
`;

const Wrapper = styled.div`
  flex-grow: 1;
  max-width: 500px;
  min-height: 230px;
  max-height: 560px;
  background-color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: all;
  border-radius: 4px;
`;

const Overlay = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background-color: hsla(0, 0%, 0%, 0.4);
  z-index: 97;
`;

const Modal = props => {
  const { children } = props;
  const { closeModal } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(modalActions.openModal());
    return () => {
      dispatch(modalActions.closeModal());
    };
  }, [dispatch]);

  return (
    <>
      <Overlay onClick={closeModal} />
      <ModalContainer>
        <Wrapper>
          {children}
        </Wrapper>
      </ModalContainer>
    </>
  );
};

Modal.defaultProps = {
  closeModal: null
};

const { func } = PropTypes;
Modal.propTypes = {
  closeModal: func
};

export default Modal;
