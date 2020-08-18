import React, { useState } from 'react'
import { connect, useDispatch } from 'react-redux';
import { Redirect } from "react-router-dom"

import styled from "styled-components";

import Button from "../components/basic/Button";
import DividerH from "../components/basic/DividerH";
import Input from '../components/basic/Input';
import Space from "../components/basic/Space";
import Text from "../components/basic/Text";

import { userOperations, userActions } from "../state/redux/user"

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`

const AuthBox = styled.form`
  min-width: 300px;
  display: flex;
  flex-direction: column;
  padding: 0 12px;
`

const Control = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const AuthBoxHeader = styled.div`
  display: flex;
  justify-content: center;
`

const AuthSwitch = styled.div`
  display: flex;
  justify-content: center;
`

const Landing = props => {
  // dispatch
  const { login, register, guestLogin } = props;
  // redux state
  const { isAuthenticated, userErrors } = props;

  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  let passwordErrors;
  let usernameErrors;
  let genericErrors;
  if (userErrors) {
    passwordErrors = userErrors.password;
    usernameErrors = userErrors.username;
    genericErrors = userErrors.errorMessage;
  }

  const passwordMatch = () => {
    if (password === confirmPassword) {
      return true;
    }
    return false;
  }

  if (isAuthenticated) {
    return <Redirect to="/posts" />
  }

  return (
    <Wrapper>
      <AuthBox>
        <AuthBoxHeader>
          <Text fontSize="24" fontWeight="500">Welcome</Text>
        </AuthBoxHeader>
        <Space height="12" />
        <DividerH />
        <Space height="24" />
        {genericErrors &&
          <>
            {genericErrors.map(errorMessage => (
              <Text key={errorMessage}
                color="red"
                fontSize="14"
              >{errorMessage}</Text>
            ))}
            <Space height="12" />
          </>
        }
        <Input
          type="text"
          autoComplete="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
        />
        {usernameErrors &&
          <>
            <Space height="6" />
            {usernameErrors.map(errorMessage => (
              <Text key={errorMessage}
                color="red"
                fontSize="14"
              >{errorMessage}</Text>
            ))}
          </>
        }
        <Space height="12" />
        <Input
          type="password"
          autoComplete="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />
        {passwordErrors &&
          <>
            <Space height="6" />
            {passwordErrors.map(errorMessage => (
              <Text key={errorMessage}
                color="red"
                fontSize="14"
              >{errorMessage}</Text>
            ))}
          </>
        }
        {isRegister &&
          <>
            <Space height="12" />
            <Input
              type="password"
              autoComplete="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
          </>
        }
        <Space height="24" />
        <Control>
          <Text
            color="hsl(206, 100%, 50%)"
            fontSize="14"
            cursor="pointer"
            onClick={() => {
              guestLogin();
            }}
          >
            Guest Mode
          </Text>
          <Button onClick={() => {
            if (isRegister) {
              if (passwordMatch()) {
                register(username, password);
              } else {
                dispatch(userActions.setErrors({
                  password: ["Password does not match"]
                }))
              }
            } else {
              login(username, password)
            }
          }}>
            {isRegister ? "Sign Up" : "Login"}
          </Button>
        </Control>
        <Space height="24" />
        <DividerH />
        <Space height="12" />
        <AuthSwitch>
          <Text fontSize="14" color="gray">
            {isRegister ?
              "Already have an account?" :
              "Don't have an account?"
            }
          </Text>
          <Space width="4" />
          <Text
            fontSize="14"
            color="hsl(206, 100%, 50%)"
            cursor="pointer"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Sign Up"}
          </Text>
        </AuthSwitch>
      </AuthBox>
    </Wrapper>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated,
  userErrors: state.user.errors
})

const mapDispatchToProps = {
  guestLogin: userOperations.guestLogin,
  login: userOperations.login,
  register: userOperations.register
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing)