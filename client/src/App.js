import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

import styled from "styled-components"

import Landing from "./pages/Landing";
import Routes from "./routing/Routes";
import { userOperations } from './state/redux/user';
import { categoryOperations } from './state/redux/category';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 860px;
  margin: 0 auto;
`

const App = props => {
  // dispatch
  const { loadUser, getCategories, guestLogin } = props;
  // redux state
  const { isAuthenticated, token, showingOverlay, isGuest } = props;
  if (showingOverlay) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuest) {
      guestLogin();
      getCategories(isGuest);
    } else if (!isAuthenticated && token) {
      loadUser(token);
      return;
    } else if (isAuthenticated) {
      getCategories();
      setLoading(false);
    }
    setLoading(false);
  }, [isAuthenticated, token, loadUser, getCategories, isGuest, guestLogin])

  if (loading) return <div></div>

  return (
    <Container showingOverlay={showingOverlay}>
      <Router>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route component={Routes} />
        </Switch>
      </Router>
    </Container>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated,
  isGuest: state.user.isGuest,
  token: state.user.token,
  showingOverlay: state.modal.showingOverlay
})

const mapDispatchToProps = {
  loadUser: userOperations.loadUser,
  guestLogin: userOperations.guestLogin,
  getCategories: categoryOperations.getCategories,
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
