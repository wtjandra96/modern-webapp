import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled from "styled-components"

import Button from "./basic/Button"
import Space from "./basic/Space";
import Text from "./basic/Text";

import { userOperations } from "../state/redux/user";

const Input = styled.input`
  width: 100%;
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  height: 32px;
  font-size: 16px;
`

const Form = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
`

const FormControl = styled.div`
  display: flex;
  justify-content: flex-end;
`

const ChangePasswordForm = props => {
  // dispatch 
  const { changePassword } = props;
  // passed function
  const { closeForm } = props;

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const passwordMatch = () => {
    if (newPassword === confirmNewPassword) {
      return true;
    }
    return false;
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
      <Space height="24" />
      <Text>Confirm Password</Text>
      <Space height="6" />
      <Input
        type="password"
        autoComplete="new-password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
      />
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
        <Button onClick={() => {
          if (passwordMatch()) {
            changePassword(oldPassword, newPassword);
          }
        }}>
          Confirm
        </Button>
        <Space width="12" />
        <Button onClick={closeForm}>Cancel</Button>
      </FormControl>
    </Form>
  )
}

const mapDispatchToProps = {
  changePassword: userOperations.changePassword
}

export default connect(null, mapDispatchToProps)(ChangePasswordForm)
