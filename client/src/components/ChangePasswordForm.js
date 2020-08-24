import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect, useDispatch } from "react-redux";
import styled from "styled-components";

import Button from "./basic/Button";
import Space from "./basic/Space";
import Text from "./basic/Text";

import { userOperations, userActions } from "../state/redux/user";

const Input = styled.input`
  width: 100%;
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  height: 32px;
  font-size: 16px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 800px;
  padding: 12px;
`;

const FormControl = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Filler = styled.div`
  flex-grow: 1;
`;

const ChangePasswordForm = props => {
  // dispatch 
  const { changePassword } = props;
  // passed function
  const { closeForm } = props;
  // redux state
  const { userErrors, currentlyProcessing } = props;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [requesting, setRequesting] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => dispatch(userActions.clearErrors());
  }, [dispatch]);

  useEffect(() => {
    if (currentlyProcessing) {
      setRequesting(true);
    }
    if (requesting && !currentlyProcessing) {
        setRequesting(false);
      if (Object.keys(userErrors).length === 0 && closeForm) {
        closeForm();
      }
    }
  }, [requesting, currentlyProcessing, userErrors, closeForm]);

  let oldPasswordErrors;
  let newPasswordErrors;
  if (userErrors) {
    oldPasswordErrors = userErrors.oldPassword;
    newPasswordErrors = userErrors.newPassword;
  }

  return (
    <Form>
      <Text>Old Password</Text>
      <Space height="6" />
      <Input
        type="password"
        autoComplete="current-password"
        value={oldPassword}
        onChange={e => setOldPassword(e.target.value)}
      />
      {oldPasswordErrors &&
        <>
          <Space height="6" />
          {oldPasswordErrors.map(errorMessage => (
            <Text key={errorMessage}
              color="red"
              fontSize="14"
            >{errorMessage}</Text>
          ))}
        </>
      }
      <Space height="24" />
      <Text>New Password</Text>
      <Space height="6" />
      <Input
        type="password"
        autoComplete="new-password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />
      {newPasswordErrors &&
        <>
          <Space height="6" />
          {newPasswordErrors.map(errorMessage => (
            <Text key={errorMessage}
              color="red"
              fontSize="14"
            >{errorMessage}</Text>
          ))}
        </>
      }
      <Space height="24" />
      <Text>Confirm New Password</Text>
      <Space height="6" />
      <Input
        type="password"
        autoComplete="new-password"
        value={confirmNewPassword}
        onChange={e => setConfirmNewPassword(e.target.value)}
      />
      <Space height="24" />
      <FormControl>
        <Filler />
        <Button onClick={() => {
          changePassword(oldPassword, newPassword, confirmNewPassword);
        }}>
          Confirm
        </Button>
        <Space width="12" />
        <Button onClick={closeForm}>Cancel</Button>
      </FormControl>
    </Form>
  );
};

const { func, string, bool, objectOf, arrayOf, shape } = PropTypes;
ChangePasswordForm.propTypes = {
  // dispatch
  changePassword: func.isRequired,
  // redux state
  userErrors: objectOf(shape({
    oldPassword: arrayOf(string),
    newPassword: arrayOf(string)
  })),
  currentlyProcessing: bool.isRequired,
  // passed function
  closeForm: func.isRequired
};

const mapStateToProps = state => ({
  userErrors: state.user.errors,
  currentlyProcessing: state.user.currentlyProcessing
});

const mapDispatchToProps = {
  changePassword: userOperations.changePassword
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordForm);
