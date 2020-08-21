import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import styled from "styled-components";

import DividerH from "./basic/DividerH";
import Dropdown from "./basic/Dropdown";
import DropdownItem from "./basic/DropdownItem";
import Modal from "./Modal";
import ModalHeader from "./basic/ModalHeader";
import Text from "./basic/Text";

import ChangePasswordForm from "./ChangePasswordForm";
import { userOperations } from "../state/redux/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Icon from "./basic/Icon";
import Space from "./basic/Space";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  margin-left: auto;
`;

const ProfilePic = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #424242;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 8px;
`;

const Avatar = props => {
  // dispatch
  const { logout } = props;
  // redux state
  const { isGuest, profile } = props;

  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal &&
        <Modal closeModal={() => setShowModal(false)}>
          <ModalHeader>
            <Text fontSize="20" fontWeight="500">Change Password</Text>
          </ModalHeader>
          <DividerH />
          <ChangePasswordForm closeForm={() => setShowModal(false)} />
        </Modal>
      }
      <Wrapper>
        <ProfilePic onClick={() => setShowDropdown(!showDropdown)}>
          <Icon color="#424242" fontSize="32" button={false}>
            <FontAwesomeIcon icon={faUser} />
          </Icon>
        </ProfilePic>
        <Dropdown show={showDropdown} bottomOffset="26" rightOffset="2" onBlur={() => {
          setShowDropdown(false);
        }}>
          {profile &&
            <>
              <Space height="4" />
              <DropdownItem cursor="default" hoverBgColor="white">
                <Text fontWeight="500">Hi, {profile.username}</Text>
              </DropdownItem>
              <Space height="4" />
              <DividerH />
            </>
          }
          {!isGuest && (
            <>
              <DropdownItem
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(false);
                  setShowModal(true);
                }}>
                <Text fontWeight="500">Change Password</Text>
              </DropdownItem>
              <DividerH />
            </>
          )}
          <DropdownItem onClick={e => {
            e.stopPropagation();
            logout();
          }}>
            <Text color="red" fontWeight="500">Logout</Text>
          </DropdownItem>
        </Dropdown>
      </Wrapper>
    </>
  );
};

const { bool, shape, string, func } = PropTypes;

Avatar.propTypes = {
  // dispatch
  logout: func.isRequired,
  // redux state
  isGuest: bool.isRequired,
  profile: shape({
    username: string.isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  isGuest: state.user.isGuest,
  profile: state.user.profile
});

const mapDispatchToProps = {
  logout: userOperations.logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Avatar);
